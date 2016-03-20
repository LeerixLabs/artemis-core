'use strict';

class Manager {
	constructor(){
		document.leerixFindElem = this.main;
	}

	main(query) {
		// Parser str
		// Modeler elems
		// Scorer DOM elems
		// Marker DOM
		document.querySelector(query).style.backgroundColor = "#98EB98";
		document.querySelector(query).setAttribute("artemis-score", "1");
		
        console.log('DBG Manager.main ');
     
    }
}

exports.leerix = new Manager();