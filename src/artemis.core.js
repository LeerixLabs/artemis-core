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
  //   	let parser = new Parser();
		// let ast = parser.parse(query);   
  //       console.log( "RESULT ", JSON.stringify(ast,null,5) );
  		let parserRes = [
		     {
		          "type": "elm-type",
		          "value": "button"
		     }
		];
		
		// Modeler elems
		let modelerJson = new Modeler().model(parserRes);
		// console.log("modelerJson", modelerJson);


		// Scorer DOM elems
		let scoreElems = new Scorer().score(modelerJson);

		// Marker DOM
		for (let elem of scoreElems){
			if(elem.score == 1){
				elem.domElm.style.backgroundColor = "#98EB98";
			}
		}
		
		
        console.log('END ');
     
    }
}

exports.leerix = new Manager();

