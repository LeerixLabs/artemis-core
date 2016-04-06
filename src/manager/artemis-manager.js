import {settings} from '../settings';
import {Parser} from '../parser/artemis-parser';
import {Planner} from '../planner/artemis-planner';
import {Scorer} from '../scorer/artemis-scorer';
import {Marker} from '../marker/artemis-marker';

/**
 * Execute artemis query returning a list of element with rank
 * @param query
 */
class Manager {
  constructor(){
    document.artemisFindElem = this.main;
    document.setttingsJSON =  settings;
    //listening to chrome extention
    if (chrome && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
        if(request.target){
        let query = request.target;
        this.main(query);
      }
    });
    }
  }

  main(query) {
    // Parser str
    let parser = new Parser();
    let parserRes = parser.parse(query);

    // Planner elems
    let plannerJson = new Planner().model(JSON.stringify(parserRes, null, ' '));
    // console.log("plannerJson", plannerJson);

// let ee = {
//   "target": {
//     "and": [
//       {
//         "scorer": "html-attr-value",
//         "param": "gettext",
//         "weight": 1
//       }
//     ]
//   }
// };
// 		plannerJson = JSON.stringify(ee);
    // Scorer DOM elems
    let scoreElems = new Scorer().score(plannerJson);

    // Marker DOM
    new Marker(scoreElems);

    console.log('END ');

  }
}

exports.artemis = new Manager();
