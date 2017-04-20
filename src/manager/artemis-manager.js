import {settings} from '../settings';
import {log} from '../common/logger';
import {storage} from '../storage/artemis-storage';
import {simulator} from '../simulator/artemis-simulator';
import Constants from '../common/common-constants';
import HtmlDOM from '../common/html-dom';
import Parser from '../parser/artemis-parser';
import Planner from '../planner/artemis-planner';
import Scorer from '../scorer/artemis-scorer';
import Marker from '../marker/artemis-marker';

export default class Manager {

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
		let that = this;
		that._htmlDom = new HtmlDOM();
		that._htmlDom.cleanDom(true);
		if (!config) {
			that._settings = settings;
		} else if (typeof config == 'string' || config instanceof String) {
			that._settings = JSON.parse(config);
		} else {
			that._settings = config;
		}
		if (that._settings && that._settings.logLevel) {
			log.setLogLevel(that._settings.logLevel);
		}
		log.debug('Manager.init() - start');
		that._parser = new Parser(that._settings);
		that._planner = new Planner(that._settings);
		that._scorer = new Scorer(that._settings, that._htmlDom);
		that._marker = new Marker(that._settings, that._htmlDom);
		log.debug('Manager.init() - end');
	}

	_find(targetInfo) {
		log.debug('Manager.find() - start');
		let that = this;
		if (!targetInfo) {
			return {};
		}
		let scoringPlan = that._planner.plan(targetInfo);
		let scoringResult = that._scorer.score(scoringPlan);
		that._marker.mark(scoringResult);
		log.debug('Manager.find() - end');
		return scoringResult;
	}

	_reset(info) {
		log.debug('Manager.reset() - start');
		let that = this;
		that._find(info.targetInfo);
		setTimeout(function () {
			that._init();
		}, 100);
		log.debug('Manager.reset() - end');
	}

	_debug(info) {
		log.debug('Manager.debug() - start');
		let that = this;
		that._find(info.targetInfo);
		log.debug('Manager.debug() - end');
	}

	_run(info) {
		log.debug('Manager.run() - start');
		let that = this;
		if (info.targetInfo) {
			let locateResult = that._find(info.targetInfo);
			if (locateResult.perfects.length > 0) {
				simulator.simulate(locateResult.perfects[0], info.actionInfo.action, info.actionInfo.value);
			}
		}
		log.debug('Manager.run() - end');
	}

	_executeNextCommand() {
		log.debug('Manager.executeNextCommand() - start');
		let that = this;
		let secondsToWaitBetweenCommandsStr = that._settings && that._settings.commands && that._settings.commands.defaultSecondsToWaitBetweenCommands || '1';
		let info = null;
		that._init(null);
		let cmd = storage.extractNextItem();
		log.debug('cmd: ' + cmd);
		if (cmd) {
			if (cmd[that._msgFieldName.COMMAND] === that._commandType.RESET) {
				info = that._parser.parse('find element');
				that._reset(info);
			} else if (cmd[that._msgFieldName.COMMAND] === that._commandType.DEBUG) {
				info = that._parser.parse(cmd.data);
				if (info.actionInfo.action !== Constants.actionType.WAIT) {
					that._debug(info);
				}
			} else if (cmd[that._msgFieldName.COMMAND] === that._commandType.RUN) {
				info = that._parser.parse(cmd.data);
				if (info.actionInfo.action !== Constants.actionType.WAIT) {
					that._run(info);
				}
			} else {
				log.error('Unknown command type');
			}
			if (storage.hasItems()) {
				if (info.actionInfo.action === Constants.actionType.WAIT && info.actionInfo.value) {
					secondsToWaitBetweenCommandsStr = info.actionInfo.value;
				}
				window.setTimeout(() => {
					that._executeNextCommand();
				}, parseFloat(secondsToWaitBetweenCommandsStr) * 1000);
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
		let that = this;
		storage.removeOldItems();
		if (storage.hasItems()) {
			that._executeNextCommand();
		}
	}

}
