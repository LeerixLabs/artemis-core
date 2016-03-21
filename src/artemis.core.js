'use strict';
import "babel-polyfill";// must be first
import {Parser} from './parser/artemis-parser';

/**
 * Execute artemis query returning a list of element with rank
 * @param query
 */
class Manager {
	constructor(){
		document.leerixFindElem = this.main;
	}

	main(query) {
		// Parser str
    	let parser = new Parser();
		let ast = parser.parse(query);
        
        console.log("Buy!!");
        console.log( JSON.stringify(ast,null,5) );

		// Modeler elems
		// Scorer DOM elems
		// Marker DOM
		// document.querySelector(query).style.backgroundColor = "#98EB98";
		// document.querySelector(query).setAttribute("artemis-score", "1");
		
        console.log('DBG Manager.main! ');
     
    }
}

exports.leerix = new Manager();