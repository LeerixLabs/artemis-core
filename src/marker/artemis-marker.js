import {ARETEMIS_CLASS} from '../constants';
"use strict";

export class Marker {
	constructor(scoreElems){
		this._getColors = this._settingColors();
        this.createSetCss;
		return this.marker(scoreElems);
	}

	marker(scoreElems){
        for (let elem of scoreElems){
            this.settingColors.forEach((color,i) => {
                // Comparison of score and the color
                if (elem.colorClass === "" 
                	&& +elem.score === 1 
                	|| elem.score >= Math.min.apply(null, color["score"]) 
                	&& elem.score < Math.max.apply(null, color["score"])){
                    elem.colorClass = i+1;
                }
            });
        }
	}

	get settingColors() {
     	return this._getColors;
    }

    get createSetCss(){
    	let css ="";
        this.settingColors.forEach((item,i) => {
    		css += `.${ARETEMIS_CLASS}${i+1}{background-color: ${item["color"]}; outline: 1px solid ${item["color"]};}`; 
    	});

		let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.getElementsByTagName('head')[0].appendChild(style);
    }

	_settingColors() {
        let colorObj = document.setttingsJSON.colors;
        let re = /\d\.\d*|\d/g;

        colorObj.map((item,i) => {
            let  m,str = Object.keys(item )[0];
            let result =[];
            while ((m = re.exec(str)) !== null) {
                if (m.index === re.lastIndex) {
                    re.lastIndex++;
                }
                result.push(m[0]);
            }
            item["score"] = result;
            item["color"] = item[str];
            return item;
        });
        return colorObj;
    }
}