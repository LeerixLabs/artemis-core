import {settings} from '../settings';
import {log} from '../common/logger';
import HtmlDOM from '../common/html-dom';
import {Parser} from '../parser/artemis-parser';
import {Planner} from '../planner/artemis-planner';
import {Scorer} from '../scorer/artemis-scorer';
import {Marker} from '../marker/artemis-marker';

export class Manager {

	constructor() {
	}

	_load() {
		let si = localStorage.getItem('artemisCore');
		if (si) {
			return JSON.parse(si);
		} else {
			return {
				'commands': []
			};
		}
	}

	_save(si) {
		localStorage.setItem('artemisCore', JSON.stringify(si));
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

		// Parse the element description sentence
		let modeledElmDesc = this._parser.parse(elmDescStr);

		// Prepare a plan for the scorer
		let scoringPlan = this._planner.plan(modeledElmDesc);

		// Score the DOM elements
		let scoringResult = this._scorer.score(scoringPlan);

		// Color the DOM elements according to their score
		this._marker.mark(scoringResult);

		log.debug('Manager.locate() - end');
		return scoringResult;
	}

	_click(command) {
		let locateResult = this._locate(command.target);
		let found = false;
		locateResult.elements.forEach( elm => {
			if (!found && elm.score === 1) {
				found = true;
				//setTimeout(function () {
				if (typeof angular !== 'undefined') {
					angular.element(elm.domElm).trigger('click');
				} else {
					elm.domElm.click();
				}
				//}, 0);
			}
		});
	}

	_write(command) {
		let locateResult = this._locate(command.target);
		let found = false;
		locateResult.elements.forEach( elm => {
			if (!found && elm.score === 1) {
				found = true;
				//setTimeout(function () {
				elm.domElm.value = command.value;
				if (typeof angular !== 'undefined') {
					angular.element(elm.domElm).trigger('keydown');
					angular.element(elm.domElm).trigger('change');
				} else {
					elm.domElm.keydown();
					elm.domElm.change();
				}
				//}, 0);
			}
		});
	}

	_run() {
		let that = this;
		let artemisCoreStorageItem = this._load();
		if (artemisCoreStorageItem['commands'].length === 0) {
			return;
		}
		this._init(null);
		this._clean();
		let cmd = artemisCoreStorageItem['commands'][0];
		if (cmd.mode === 'debug') {
			this._locate(cmd.target);
		} else if (cmd.mode === 'run') {
			if (cmd.action === 'locate') {
				this._locate(cmd.target);
			} else if (cmd.action === 'click') {
				this._click(cmd);
			} else if (cmd.action === 'write') {
				this._write(cmd);
			} else {
				log.error('Unsupported command action');
			}
		} else {
			log.error('Unsupported command mode');
		}
		artemisCoreStorageItem['commands'].splice(0, 1);
		this._save(artemisCoreStorageItem);
		if (artemisCoreStorageItem['commands'].length > 0) {
			setTimeout(function () {
				that._run();
			}, 4000);
		}
	}

	execute(commands) {
		let artemisCoreStorageItem = this._load();
		artemisCoreStorageItem['commands'].push.apply(artemisCoreStorageItem['commands'], commands);
		this._save(artemisCoreStorageItem);
		this._run();
	}

}
