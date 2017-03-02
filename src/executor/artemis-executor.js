import {log} from '../common/logger';

class Executor {

	constructor() {
		this._actionType = {
			LOCATE: 'locate',
			CLICK: 'click',
			WRITE: 'write'
		};
	}

	_click(elm) {
		log.debug('Executor.click() - start');
		if (typeof angular !== 'undefined') {
			angular.element(elm.domElm).trigger('click');
		} else {
			elm.domElm.click();
		}
		log.debug('Executor.click() - end');
	}

	_write(elm, value) {
		log.debug('Executor.write() - start');
		elm.domElm.value = value;
		if (typeof angular !== 'undefined') {
			angular.element(elm.domElm).trigger('keydown');
			angular.element(elm.domElm).trigger('change');
		} else {
			elm.domElm.keydown();
			elm.domElm.change();
		}
		log.debug('Executor.write() - end');
	}

	runAction(elm, action, value) {
		if (action === this._actionType.CLICK) {
			this._click(elm);
		} else if (action === this._actionType.WRITE) {
			this._write(elm, value);
		}
	}
}

module.exports.executor = new Executor();
