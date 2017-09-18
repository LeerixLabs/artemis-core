export default class Constants {

	static get msgFieldName() {
		return {
			COMMAND: 	'command',
			DATA: 		'data'
		}
	};

	static get commandType() {
		return {
			RESET: 	'reset',
			DEBUG: 	'debug',
			RUN: 	'run'
		}
	};

	static get actionType() {
		return {
			LOCATE:	'locate',
			CLICK: 	'click',
			SET: 	'set',
			WAIT: 	'wait'
		}
	};

	static get artemisColorClassesExistAttr() {
		return 'artemis-color-classes-exist';
	}

	static get artemisElmIdsExistAttr() {
		return 'artemis-elm-ids-exist';
	}

	static get artemisElmScoresExistAttr() {
		return 'artemis-elm-scores-exist';
	}

	static get artemisElmClassesExistAttr() {
		return 'artemis-elm-classes-exist';
	}

	static get artemisStyleId() {
		return 'artemis-classes';
	}

	static get artemisElmIdAttr() {
		return 'artemis-id';
	}

	static get artemisElmScoreAttr() {
		return 'artemis-score';
	}

	static get artemisElmClassPrefix() {
		return 'artemis-class-';
	}

	static get artemisElmClassSingleMatchSuffix() {
		return 'single-match';
	}

}
