'use strict';
// import "babel-polyfill";// must be first d
import {Parser} from './parser/artemis-parser';
import {Modeler} from './modeler/artemis-modeler';
import {Scorer} from './scorer/artemis-scorer';
import {Marker} from './marker/artemis-marker';
import {settings} from './settings';

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
    	console.log("modelerJson", modelerJson);

// let ee = {"target":{"and":[{"or":[{"scorer":"html-tag","param":"element","weight":1}]},{"scorer":"target-relation","param":"left-of","weight":1,"target":{"scorer":"free-text","param":"Button 2","weight":1}}]}};
// 		let ee = {
//   "target": {
//     "and": [
//       {
//         "or": [
//           {
//             "scorer": "html-tag",
//             "param": "element",
//             "weight": 1
//           }
//         ]
//       },
//       {
//         "or": [
//           {
//             "scorer": "html-attr-value",
//             "param": "gettext",
//             "weight": 1
//           }
//         ]
//       }
//     ]
//   }
// };
    // modelerJson = JSON.stringify(ee);
		// Scorer DOM elems
		let scoreElems = new Scorer().score(modelerJson);

		// Marker DOM
    new Marker(scoreElems);

        console.log('END ');
     
    }
}

exports.leerix = new Manager();

