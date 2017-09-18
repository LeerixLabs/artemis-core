import {log} from '../common/logger';
import Constants from '../common/common-constants';
import Helper from '../common/common-helper';

class Simulator {

	constructor(settings) {
		this._settings = settings;
		this._eventMatchers = [
			{
				eventType: 'HTMLEvents',
				eventNames: /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/
			},
			{
				eventType: 'MouseEvents',
				eventNames: /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
			}
		];
		this._defaultOptions = {
			pointerX: 0,
			pointerY: 0,
			button: 0,
			ctrlKey: false,
			altKey: false,
			shiftKey: false,
			metaKey: false,
			bubbles: true,
			cancelable: true
		};
	}

	_triggerEvent(domElm, eventName, specialOptions) {
		let eventType = null;
		this._eventMatchers.forEach(function(em) {
			if (em.eventNames.test(eventName)) {
				eventType = em.eventType;
			}
		});
		if (!eventType) {
			log.error(`Unsupported event type for event name ${eventName}`);
			return;
		}
		let options = specialOptions ? Helper.extend(this._defaultOptions, specialOptions) : this._defaultOptions;
		let oEvent = null;
		if (document.createEvent) {
			if (eventType == 'HTMLEvents') {
				oEvent = document.createEvent(eventType);
				oEvent.initEvent(eventName, options.bubbles, options.cancelable);
			} else if (eventType == 'MouseEvents') {
				oEvent = new MouseEvent(eventName, options);
			}
			domElm.dispatchEvent(oEvent);
		} else {
			options.clientX = options.pointerX;
			options.clientY = options.pointerY;
			let evt = document.createEventObject();
			oEvent = Helper.extend(evt, options);
			domElm.fireEvent('on' + eventName, oEvent);
		}
	}

	_getSelectOptionValue(domElm, value) {
		let retVal = null;
		if (domElm.children && domElm.children.length) {
			for (let i = 0; i < domElm.children.length; i++) {
				let child = domElm.children[i];
				if (!retVal && child && child.tagName && child.tagName.toLowerCase() === 'option'
				&& (child.value === value || child.text === value || child.innerText === value || child.textContent === value)) {
					retVal = child.value;
				}
			}
		}
		return retVal;
	}

	_set(domElm, value) {
		log.debug('Simulator.set() - start');
		this._click(domElm);
		let valueToSet = (domElm.tagName.toLowerCase() === 'select') ? this._getSelectOptionValue(domElm, value) : value;
		if (valueToSet) {
			domElm.value = valueToSet;
			this._triggerEvent(domElm, 'change');
		}
		log.debug('Simulator.set() - end');
	}

	_click(domElm) {
		log.debug('Simulator.click() - start');
		this._triggerEvent(domElm, 'mouseover');
		this._triggerEvent(domElm, 'mousedown');
		this._triggerEvent(domElm, 'click');
		this._triggerEvent(domElm, 'mouseup');
		log.debug('Simulator.click() - end');
	}

	simulate(elm, action, value) {
		log.debug('Simulator.simulate() - start');
		log.debug(`elmId: ${elm.id}, elmTag: ${elm.tagName}, action: ${action}, value: ${value}`);
		let domElm = elm.domElm;
		if (action === Constants.actionType.CLICK) {
			this._click(domElm);
		} else if (action === Constants.actionType.SET) {
			this._set(domElm, value);
		} else if (action !== Constants.actionType.LOCATE && action !== Constants.actionType.WAIT) {
			log.error('Unsupported action');
		}
		log.debug('Simulator.simulate() - end');
	}
}

module.exports.simulator= new Simulator();
