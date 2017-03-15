import {settings} from '../settings';
import {log} from '../common/logger';
import {storage} from '../storage/artemis-storage';
import {simulator} from '../simulator/artemis-simulator';
import HtmlDOM from '../common/html-dom';
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
	}

	_init(config) {
		this._htmlDom = new HtmlDOM();
		this._htmlDom.cleanDom(true);
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
		this._parser = new Parser(this._settings);
		this._planner = new Planner(this._settings);
		this._scorer = new Scorer(this._settings, this._htmlDom);
		this._marker = new Marker(this._settings, this._htmlDom);
		log.debug('Manager.init() - end');
	}

	_find(targetInfo) {
		log.debug('Manager.find() - start');
		if (!targetInfo) {
			return {};
		}
		let scoringPlan = this._planner.plan(targetInfo);
		let scoringResult = this._scorer.score(scoringPlan);
		this._marker.mark(scoringResult);
		log.debug('Manager.find() - end');
		return scoringResult;
	}

	_reset() {
		log.debug('Manager.reset() - start');
		let that = this;
		let info = that._parser.parse('find element');
		that._find(info.targetInfo);
		setTimeout(function () {
			that._init();
		}, 100);
		log.debug('Manager.reset() - end');
	}

	_debug(cmd) {
		log.debug('Manager.debug() - start');
		let that = this;
		let info = that._parser.parse(cmd.data);
		that._find(info.targetInfo);
		log.debug('Manager.debug() - end');
	}

	_run(cmd) {
		log.debug('Manager.run() - start');
		let that = this;
		let info = that._parser.parse(cmd.data);
		if (info.targetInfo) {
			let locateResult = that._find(info.targetInfo);
			if (locateResult.perfects.length > 0) {
				simulator.simulate(locateResult.perfects[0], info.sentenceInfo.action, info.sentenceInfo.value);
			}
		}
		log.debug('Manager.run() - end');
	}

	_executeNextCommand() {
		log.debug('Manager.executeNextCommand() - start');
		let that = this;
		that._init(null);
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
			if (storage.hasItems()) {
				window.setTimeout(() => {
					that._executeNextCommand();
				}, 3000);
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
		commands.forEach(function(c) {
			if (c[that._msgFieldName.COMMAND] === that._commandType.RESET) {
				storage.clear();
				storage.append(c);
			} else if (c[that._msgFieldName.COMMAND] === that._commandType.DEBUG) {
				storage.append(c);
			} else if (c[that._msgFieldName.COMMAND] === that._commandType.RUN) {
				storage.append(c);
			} else {
				log.error('Unknown command type');
			}
		});
		that._executeNextCommand();
		log.debug('Manager.execute() - end');
	}

	locate(description) {
		log.debug('Parser.locate() - start');
		log.debug(`description: ${description}`);
		let that = this;
		let targetInfo = that._parser.parseDescription(description);
		let scoringResult = that._find(targetInfo);
		log.debug('Parser.locate() - end');
		return scoringResult;
	}

	onLoad() {
		storage.removeOldItems();
		if (storage.hasItems()) {
			this._executeNextCommand();
		}
	}

}
