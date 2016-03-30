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
//let parserRes = JSON.stringify( [{"type": "elm-type", "value": "input"},{"type": "elm-type", "value": "button"}], null, ' ');		
		// Modeler elems
		let modelerJson = new Modeler().model(parserRes);
		// console.log("vmodelerJson", modelerJson);

/*
	TEST DATA
*/
		let modele = {"target":{"and":[{"or":[{"scorer":"html-tag","param":"button","weight":1},{"and":[{"scorer":"html-tag","param":"input","weight":1},{"scorer":"html-attr-key-and-value","param":["type","button"],"weight":1}],"weight":1},{"and":[{"scorer":"html-tag","param":"input","weight":1},{"scorer":"html-attr-key-and-value","param":["type","submit"],"weight":1}],"weight":1},{"and":[{"scorer":"html-tag","param":"a","weight":1},{"scorer":"css-class","param":["button","btn"],"weight":1}],"weight":0.8},{"and":[{"scorer":"html-tag","param":"img","weight":1},{"scorer":"css-class","param":["button","btn"],"weight":1}],"weight":0.6},{"and":[{"scorer":"html-tag","param":"div","weight":1},{"scorer":"css-class","param":["button","btn"],"weight":1}],"weight":0.4}]},{"scorer":"target-relation","param":"left of","weight":1,"target":{"or":[{"scorer":"html-tag","param":"button","weight":1},{"and":[{"scorer":"html-tag","param":"input","weight":1},{"scorer":"html-attr-key-and-value","param":["type","button"],"weight":1}],"weight":1},{"and":[{"scorer":"html-tag","param":"input","weight":1},{"scorer":"html-attr-key-and-value","param":["type","submit"],"weight":1}],"weight":1},{"and":[{"scorer":"html-tag","param":"a","weight":1},{"scorer":"css-class","param":["button","btn"],"weight":1}],"weight":0.8},{"and":[{"scorer":"html-tag","param":"img","weight":1},{"scorer":"css-class","param":["button","btn"],"weight":1}],"weight":0.6}]}},{"scorer":"target-relation","param":"right of","weight":1,"target":{"or":[{"scorer":"html-tag","param":"button","weight":1},{"and":[{"scorer":"html-tag","param":"input","weight":1},{"scorer":"html-attr-key-and-value","param":["type","button"],"weight":1}],"weight":1},{"and":[{"scorer":"html-tag","param":"input","weight":1},{"scorer":"html-attr-key-and-value","param":["type","submit"],"weight":1}],"weight":1},{"and":[{"scorer":"html-tag","param":"a","weight":1},{"scorer":"css-class","param":["button","btn"],"weight":1}],"weight":0.8},{"and":[{"scorer":"html-tag","param":"img","weight":1},{"scorer":"css-class","param":["button","btn"],"weight":1}],"weight":0.6}]}}]}};
		 modelerJson = JSON.stringify( modele, null, ' ');

/*
    END TEST DATA
*/

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

