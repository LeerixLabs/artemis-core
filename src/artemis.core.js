'use strict';
import "babel-polyfill";// must be first
import {Parser} from './parser/artemis-parser';
import {Scorer} from './scorer/artemis-scorer';

/**
 * Execute artemis query returning a list of element with rank
 * @param query
 */
class Manager {
	constructor(){
		fetch('settings.json')
          .then(function(response) {
            return response.json();
           })
          .then(function(settings) {
             document.setttingsJSON =  settings;
          })
          .catch( function(settings) {
            throw new Error("Error: Can not read settings.json");
          }); 

		document.leerixFindElem = this.main;

	}

	main(query) {
		// Parser str
    	let parser = new Parser();
		let ast = parser.parse(query);
        // throw new Error(document.setttingsJSON);
     
        // console.log( "RESULT ", JSON.stringify(ast,null,5) );
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

