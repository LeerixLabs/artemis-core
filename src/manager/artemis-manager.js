import {defaultSettings} from '../../src/settings/default-settings';
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

	_postFindResult(msg) {
		window.postMessage({type: 'artemis-msg-find-result-artemis-core', msg: '' + msg}, '*');
	}

	_init() {
		let that = this;
		that._htmlDom = new HtmlDOM();
		that._htmlDom.cleanDom(true);
		let storedSettings = storage.getSettings();
		if (storedSettings && (typeof storedSettings == 'string' || storedSettings instanceof String)) {
			that._settings = JSON.parse(storedSettings);
		} else {
			that._settings = defaultSettings;
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
		let scoringResult = null;
		if (targetInfo) {
			let scoringPlan = that._planner.plan(targetInfo);
			scoringResult = that._scorer.score(scoringPlan);
			that._marker.mark(scoringResult);
			that._postFindResult(scoringResult.perfects.length);
		} else {
			that._postFindResult(0);
		}
		log.debug('Manager.find() - end');
		return scoringResult;
	}

	_reset() {
		log.debug('Manager.reset() - start');
		let that = this;
		that._marker.markEverything();
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
			let findResult = that._find(info.targetInfo);
			if (findResult.perfects.length > 0) {
				simulator.simulate(findResult.perfects[0], info.actionInfo.action, info.actionInfo.value);
			}
		}
		log.debug('Manager.run() - end');
	}

	_executeNextCommand() {
		log.debug('Manager.executeNextCommand() - start');
		let that = this;
		let info = null;
		that._postFindResult('');
		that._init();
		let cmd = storage.extractNextItem();
		log.debug('cmd: ' + cmd);
		if (cmd) {
			let commandType = cmd[Constants.msgFieldName.COMMAND];
			if (commandType === Constants.commandType.RESET) {
				that._reset();
			} else if (commandType === Constants.commandType.DEBUG) {
				info = that._parser.parse(commandType, cmd.data);
				if (info.actionInfo.action !== Constants.actionType.WAIT) {
					that._debug(info);
				}
			} else if (commandType === Constants.commandType.RUN) {
				info = that._parser.parse(commandType, cmd.data);
				if (info.actionInfo.action !== Constants.actionType.WAIT) {
					that._run(info);
				}
			} else {
				log.error('Unknown command type');
			}
			if (storage.hasItems()) {
				let secondsToWaitBetweenCommandsStr = that._settings && that._settings.commands && that._settings.commands.defaultSecondsToWaitBetweenCommands || '2';
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
		commands.forEach(function(cmd) {
			let commandType = cmd[Constants.msgFieldName.COMMAND];
			let commandData = cmd[Constants.msgFieldName.DATA];
			if (commandType === Constants.commandType.RESET) {
				if (commandData) {
					storage.saveSettings(commandData)
				}
				storage.clear();
			}
			if (commandType === Constants.commandType.RESET || commandType === Constants.commandType.DEBUG || commandType === Constants.commandType.RUN) {
				storage.append(cmd);
			} else {
				log.error('Unknown command type: ' + commandType);
			}
		});
		that._executeNextCommand();
		log.debug('Manager.execute() - end');
	}

	locate(description) {
		log.debug('Manager.locate() - start');
		log.debug(`description: ${description}`);
		let that = this;
		let targetInfo = that._parser.parseDescription(description);
		let scoringResult = that._find(targetInfo);
		log.debug('Manager.locate() - end');
		return scoringResult;
	}

	onLoad() {
		let that = this;
		that._postFindResult('');
		storage.removeOldItems();
		if (storage.hasItems()) {
			that._executeNextCommand();
		}
	}

}
