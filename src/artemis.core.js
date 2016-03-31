'use strict';
import "babel-polyfill";// must be first
import {Parser} from './parser/artemis-parser';
import {Modeler} from './modeler/artemis-modeler';
import {Scorer} from './scorer/artemis-scorer';
import {settings} from './settings';
// import {settings} from './settings_v0';


/**
 * Execute artemis query returning a list of element with rank
 * @param query
 */
class Manager {
	constructor(){
		document.leerixFindElem = this.main;
		document.setttingsJSON =  settings;
	}

	main(query) {
		// Parser str
     	let parser = new Parser();
		let parserRes = parser.parse(query);
		//console.log('res - ',parserRes)   
//let parserRes = JSON.stringify( [{"type": "elm-type", "value": "input"},{"type": "elm-type", "value": "button"}], null, ' ');		
		// Modeler elems
		let modelerJson = new Modeler().model(JSON.stringify(parserRes, null, ' '));
    	console.log("modelerJson", modelerJson);


		// Scorer DOM elems
		/*let scoreElems = new Scorer().score(modelerJson);

		// Marker DOM
		for (let elem of scoreElems){
			if(elem.score == 1){
				elem.domElm.style.backgroundColor = "#98EB98";
			}
		}*/
		
		
        console.log('END ');
     
    }
}

exports.leerix = new Manager();

