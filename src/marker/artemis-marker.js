import {ARETEMIS_CLASS} from '../constants';
"use strict";

export class Marker {
	constructor(scoreElems){
        this.createSetCss;
		return this.marker(scoreElems);
	}

	marker(scoreElems){
        for (let elem of scoreElems){
                if(elem.colorClass === "" && elem.unicue){
                    elem.colorClass = 0;
                } else {
                    let arrColor = document.setttingsJSON.colors["score-colors"];
                    // Comparison of score and the color
                    arrColor.forEach((item,i) => {
                        if (elem.colorClass === "" && elem.score >= item.value){
                            elem.colorClass = i+1;
                        }
                    });
                }


        }
	}

    get createSetCss(){
        let unicueColor = document.setttingsJSON.colors["single-match-color"];
        let css = `.${ARETEMIS_CLASS}0{background-color: ${unicueColor}; outline: 1px solid ${unicueColor};}`; 
        
        document.setttingsJSON.colors["score-colors"].forEach((item,i) => {
         css += `.${ARETEMIS_CLASS}${i+1}{background-color: ${item.color}; outline: 1px solid ${item.color};}`; 
        });

        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.getElementsByTagName('head')[0].appendChild(style);
    }
}