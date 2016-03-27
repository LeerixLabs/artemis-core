'use strict';
import "babel-polyfill";// must be first
import {Parser} from './parser/artemis-parser';
import {Scorer} from './scorer/artemis-scorer';
import {settings} from './settings';


/**
 * Execute artemis query returning a list of element with rank
 * @param query
 */
class Manager {
	constructor(){
		document.leerixFindElem = this.main;
		document.setttingsJSON =  settings;
		console.log("zxczx",settings);
	}

	main(query) {
		// Parser str
    	let parser = new Parser();
		let ast = parser.parse(query);
        // throw new Error(document.setttingsJSON);
     
        console.log( "RESULT ", JSON.stringify(ast,null,5) );
        // console.log( "RESULT ", JSON.stringify(ast,null,5));

		// Modeler elems
		// Scorer DOM elems
		let scoreElems = new Scorer().score(query);

		// Marker DOM
		for (let elem of scoreElems){
			if(elem.score == 1){
				elem.domElm.style.backgroundColor = "#98EB98";
			}
		}
		
		
        console.log('DBG Manager.main! ');
     
    }
}

exports.leerix = new Manager();

