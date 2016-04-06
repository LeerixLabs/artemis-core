import {settings} from '../settings';
import {Parser} from '../parser/artemis-parser';
import {Planner} from '../planner/artemis-planner';
import {Scorer} from '../scorer/artemis-scorer';
import {Marker} from '../marker/artemis-marker';

class Manager {

  constructor() {
    this._settings = {};
    this.init(settings);
  }

  get settings() {
    return this._settings;
  }

  set settings(settings) {
    // Settings can either be a JSON string, or an object
    if (typeof settings == 'string' || settings instanceof String) {
      this._settings = JSON.parse(settings);
    } else {
      this._settings = settings;
    }
  }

  init(settings) {
    this.settings = settings;
    document.artemisLocate = this.locate;

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

  static locate(query) {
    // Parse the query sentence
    let parser = new Parser(this.settings);
    let parserRes = parser.parse(query);

    // Prepare a plan for the scorer
    let planner = new Planner(this.settings);
    let plannerJson = planner.model(JSON.stringify(parserRes, null, ' '));

    // Score the DOM elements
    let scorer = new Scorer(this.settings);
    let scoreElems = scorer.score(plannerJson);

    // Color the DOM elements according to their score
    let marker = new Marker(this.settings);
    marker.mark(scoreElems);
  }
}

exports.artemis = new Manager();
