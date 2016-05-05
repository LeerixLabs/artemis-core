import {settings} from '../settings';
import {log} from '../common/logger';
import {Parser} from '../parser/artemis-parser';
import {Planner} from '../planner/artemis-planner';
import {Scorer} from '../scorer/artemis-scorer';
import {Marker} from '../marker/artemis-marker';

export class Manager {

  constructor() {
  }

  registerGlobalFunctions() {
    document.artemisInit = this.init;
    document.artemisLocate = this.locate;
  }

  init(config) {
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
    this._parser = new Parser(this._settings);
    this._planner = new Planner(this._settings);
    this._scorer = new Scorer(this._settings);
    this._marker = new Marker(this._settings);

    this._marker.addColorClassesToHtmlDocHead();

    //TODO: core code should not be aware of its Chrome extension consumer

  }

  locate(query) {
    // Parse the query sentence
    let modeledQuery = this._parser.parse(query);
    console.log(' modeledQuery: ', JSON.stringify(modeledQuery));
    // Prepare a plan for the scorer
    let scoringPlan = this._planner.plan(modeledQuery);
    console.log('plan: ',JSON.stringify(scoringPlan));
    // Score the DOM elements
    let scoringResult = this._scorer.score(scoringPlan);

    // Color the DOM elements according to their score
    this._marker.mark(scoringResult);

    return scoringResult;
  }
}
