import {settings} from '../settings';
import {log} from '../common/logger';
import {storage} from '../storage/artemis-storage';
import {executor} from '../executor/artemis-executor';
import HtmlDOM from '../common/html-dom';
import {SentenceParser} from '../parser/artemis-sentence-parser';
import {Parser} from '../parser/artemis-parser';
import {Planner} from '../planner/artemis-planner';
import {Scorer} from '../scorer/artemis-scorer';
import {Marker} from '../marker/artemis-marker';

export class Manager {

	constructor() {
		this._msgFieldName = {
			COMMAND: 'command',
			DATA: 'data'
		};

		this._commandType = {
			RESET: 'reset',
			DEBUG: 'debug',
			RUN: 'run'
		};

		this._actionType = {
			LOCATE: 'locate',
			CLICK: 'click',
			WRITE: 'write'
		};
	}

	_init(config) {
		this._htmlDom = new HtmlDOM();
		if (!config) {
			this._settings = settings;
		} else if (typeof config == 'string' || config instanceof String) {
			this._settings = JSON.parse(config);
		} else {
			this._settings = config;
		}
		if (this._settings && this._settings['log-level']) {
			log.setLogLevel(this._settings['log-level']);
		}
		log.debug('Manager.init() - start');
		this._sentenceParser = new SentenceParser(this._settings);
		this._parser = new Parser(this._settings);
		this._planner = new Planner(this._settings);
		this._scorer = new Scorer(this._settings, this._htmlDom);
		this._marker = new Marker(this._settings, this._htmlDom);
		log.debug('Manager.init() - end');
	}

	_clean() {
		log.debug('Manager.clean() - start');
		(new HtmlDOM()).cleanDom(true);
		log.debug('Manager.clean() - end');
	}

	_locate(elmDescStr) {
		log.debug('Manager.locate() - start');
		let modeledElmDesc = this._parser.parse(elmDescStr);
		let scoringPlan = this._planner.plan(modeledElmDesc);
		let scoringResult = this._scorer.score(scoringPlan);
		this._marker.mark(scoringResult);
		log.debug('Manager.locate() - end');
		return scoringResult;
	}

	_reset() {
		log.debug('Manager.reset() - start');
		let that = this;
		that._locate('element');
		setTimeout(function () {
			that._clean();
		}, 100);
		log.debug('Manager.reset() - end');
	}

	_debug(cmd) {
		log.debug('Manager.debug() - start');
		let that = this;
		let info = that._sentenceParser.parse(cmd.data);
		if (info.target) {
			that._locate(info.target);
		}
		log.debug('Manager.debug() - end');
	}

	_run(cmd) {
		log.debug('Manager.run() - start');
		let that = this;
		let info = that._sentenceParser.parse(cmd.data);
		if (info.target) {
			let res = that._locate(info.target);
			if (res.perfects.length > 0) {
				executor.runAction(res.perfects[0], info.action, info.value);
			}
		}
		log.debug('Manager.run() - end');
	}

	_executeNextCommand() {
		log.debug('Manager.executeNextCommand() - start');
		let that = this;
		that._init(null);
		that._clean();
		let cmd = storage.extractNextItem();
		log.debug('cmd: ' + cmd);
		if (cmd) {
			if (cmd[that._msgFieldName.COMMAND] === that._commandType.RESET) {
				that._reset();
			} else if (cmd[that._msgFieldName.COMMAND] === that._commandType.DEBUG) {
				that._debug(cmd);
			} else if (cmd[that._msgFieldName.COMMAND] === that._commandType.RUN) {
				that._run(cmd);
			} else {
				log.error('Unknown command type');
			}
		} else {
			log.debug('No commands in storage');
		}
		log.debug('Manager.executeNextCommand() - end');
	}

	execute(commands) {
		log.debug('Manager.execute() - start');
		log.debug('commands: ' + JSON.stringify(commands));
		let that = this;
		storage.removeOldItems();
		let resetFound = false;
		commands.forEach(function(c) {
			if (!resetFound) {
				if (c[that._msgFieldName.COMMAND] === that._commandType.RESET) {
					resetFound = true;
					storage.clear();
					storage.append(c);
				} else if (c[that._msgFieldName.COMMAND] === that._commandType.DEBUG) {
					storage.append(c);
				} else if (c[that._msgFieldName.COMMAND] === that._commandType.RUN) {
					storage.append(c);
				} else {
					log.error('Unknown command type');
				}
			}
		});
		that._executeNextCommand();
		log.debug('Manager.execute() - end');
	}

	onLoad() {
		storage.removeOldItems();
		if (storage.hasItems()) {
			this._executeNextCommand();
		}
	}

}
