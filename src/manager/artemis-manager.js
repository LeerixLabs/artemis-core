import {settings} from '../settings';
import {Parser} from '../parser/artemis-parser';
import {Modeler} from '../modeler/artemis-modeler';
import {Scorer} from '../scorer/artemis-scorer';
import {Marker} from '../marker/artemis-marker';

/**
 * Execute artemis query returning a list of element with rank
 * @param query
 */
class Manager {
  constructor(){
    document.leerixFindElem = this.main;
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

    // Modeler elems
    let modelerJson = new Modeler().model(JSON.stringify(parserRes, null, ' '));
    // console.log("modelerJson", modelerJson);

// let ee = {
//   "target": {
//     "and": [
//       {
//         "scorer": "free-text",
//         "param": "Try it",
//         "weight": 1
//       }
//     ]
//   }
// };
// 		modelerJson = JSON.stringify(ee);
    // Scorer DOM elems
    let scoreElems = new Scorer().score(modelerJson);

    // Marker DOM
    new Marker(scoreElems);

    console.log('END ');

  }
}

exports.leerix = new Manager();
