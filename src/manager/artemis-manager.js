import {settings} from '../settings';
import {Parser} from '../parser/artemis-parser';
import {Planner} from '../planner/artemis-planner';
import {Scorer} from '../scorer/artemis-scorer';
import {Marker} from '../marker/artemis-marker';

class Manager {

  constructor() {
    this._registerGlobalFunctions();
  }

  _registerGlobalFunctions() {
    document.artemisInit = this.init;
    document.artemisLocate = this.locate;
  }

  init(config) {
    if (!config) {
      this.settings = settings;
    } else if (typeof config == 'string' || config instanceof String) {
      this.settings = JSON.parse(config);
    } else {
      this.settings = config;
    }

    //TODO: core code should not be aware of its Chrome extension consumer
    if (chrome && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
        if (request.target) {
          let query = request.target;
          this.main(query);
        }
      });
    }
  }

  locate(query) {
    // Parse the query sentence
    let parser = new Parser(this.settings);
    let modeledQuery = parser.parse(query);

    // Prepare a plan for the scorer
    let planner = new Planner(this.settings);
    let scoringPlan = planner.plan(modeledQuery);

    // Score the DOM elements
    let scorer = new Scorer(this.settings);
    let scoringResult = scorer.score(scoringPlan);

    // Color the DOM elements according to their score
    let marker = new Marker(this.settings);
    marker.mark(scoringResult);

    return scoringResult;
  }
}

exports.artemis = new Manager();
