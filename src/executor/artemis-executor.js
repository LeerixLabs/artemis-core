import {log} from '../common/logger';

class Executor {

	constructor() {

	}

	click(elm) {
		log.debug('Executor.click() - start');
		if (typeof angular !== 'undefined') {
			angular.element(elm.domElm).trigger('click');
		} else {
			elm.domElm.click();
		}
		log.debug('Executor.click() - end');
	}

	write(elm, value) {
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
}

module.exports.executor = new Executor();
