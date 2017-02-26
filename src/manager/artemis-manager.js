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

  init(config) {
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

  clean() {
    log.debug('Manager.clean() - start');
    (new HtmlDOM()).cleanDom(true);
    log.debug('Manager.clean() - end');
  }

  locate(elmDescStr) {
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

  run(command) {
  	let locateResult = this.locate(command.target);
    let found = false;
    locateResult.elements.forEach( elm => {
  		if (!found && elm.score === 1) {
			found = true;
			if (command.action === 'click') {
				if (typeof angular !== 'undefined') {
					angular.element(elm.domElm).trigger('click');
				} else {
					elm.domElm.click();
				}
			} else if (command.action === 'write') {
				setTimeout(function () {
					elm.domElm.value = command.value;
					if (typeof angular !== 'undefined') {
						angular.element(elm.domElm).trigger('keydown');
						angular.element(elm.domElm).trigger('change');
					} else {
						elm.domElm.keydown();
						elm.domElm.change();
					}
				}, 0);
			}
	  	}
    });
  }

  command(command) {
    if (command.mode === 'debug') {
      this.locate(command.target);
    } else if (command.mode === 'run') {
      this.run(command)
    } else {
		log.debug('Usupported command mode');
    }
  }
}
