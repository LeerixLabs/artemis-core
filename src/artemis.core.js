'use strict';
import "babel-polyfill";// must be first
import {Parser} from './parser/artemis-parser';

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
        
        console.log( "RESULT ", JSON.stringify(ast,null,5) );

		// Modeler elems
		// Scorer DOM elems
		// Marker DOM
		// document.querySelector(query).style.backgroundColor = "#98EB98";
		// document.querySelector(query).setAttribute("artemis-score", "1");
		
        console.log('DBG Manager.main! ');
     
    }
}

exports.leerix = new Manager();