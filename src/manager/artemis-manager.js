import {settings} from '../settings';
import {Parser} from '../parser/artemis-parser';
import {Planner} from '../planner/artemis-planner';
import {Scorer} from '../scorer/artemis-scorer';
import {Marker} from '../marker/artemis-marker';

export class Manager {

  constructor() {
    this._registerGlobalFunctions();
  }

  _registerGlobalFunctions() {
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
    this._parser = new Parser(this._settings);
    this._planner = new Planner(this._settings);
    this._scorer = new Scorer(this._settings);
    this._marker = new Marker(this._settings);

    this.marker.addColorClassesToHtmlDocHead();

    //TODO: core code should not be aware of its Chrome extension consumer
    if (chrome && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
        if (request.target) {
          let query = request.target;
          this.locate(query);
        }
      });
    }
  }

  locate(query) {
    // Parse the query sentence
    let modeledQuery = this._parser.parse(query);

    // Prepare a plan for the scorer
    let scoringPlan = this._planner.plan(modeledQuery);

    // Score the DOM elements
    let scoringResult = this._scorer.score(scoringPlan);

    // Color the DOM elements according to their score
    this._marker.mark(scoringResult);

    return scoringResult;
  }
}

exports.artemis = new Manager();
