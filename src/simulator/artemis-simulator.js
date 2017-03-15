import {log} from '../common/logger';
import Helper from  '../common/common-helper';

class Simulator {

	constructor() {
		this._actionType = {
			LOCATE: 'locate',
			CLICK: 'click',
			WRITE: 'write'
		};
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

	_simulate(element, eventName, specialOptions) {
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
			oEvent = document.createEvent(eventType);
			if (eventType == 'HTMLEvents') {
				oEvent.initEvent(eventName, options.bubbles, options.cancelable);
			} else if (eventType == 'MouseEvents') {
				oEvent = new MouseEvent(eventName, options);
			}
			element.dispatchEvent(oEvent);
		} else {
			options.clientX = options.pointerX;
			options.clientY = options.pointerY;
			let evt = document.createEventObject();
			oEvent = Helper.extend(evt, options);
			element.fireEvent('on' + eventName, oEvent);
		}
	}

	_click(elm) {
		log.debug('Simulator.click() - start');
		this._simulate(elm.domElm, 'mouseover');
		this._simulate(elm.domElm, 'mousedown');
		this._simulate(elm.domElm, 'click');
		this._simulate(elm.domElm, 'mouseup');
		log.debug('Simulator.click() - end');
	}

	_write(elm, value) {
		log.debug('Simulator.write() - start');
		elm.domElm.focus();
		elm.domElm.value = value;
		this._simulate(elm.domElm, 'change');
		log.debug('Simulator.write() - end');
	}

	simulate(elm, action, value) {
		log.debug('Simulator.simulate() - start');
		log.debug(`elmId: ${elm.id}, elmTag: ${elm.tagName}, action: ${action}, value: ${value}`);
		if (action === this._actionType.CLICK) {
			this._click(elm);
		} else if (action === this._actionType.WRITE) {
			this._write(elm, value);
		} else if (action !== this._actionType.LOCATE) {
			log.error('Unsupported action');
		}
		log.debug('Simulator.simulate() - end');
	}
}

module.exports.simulator = new Simulator();
