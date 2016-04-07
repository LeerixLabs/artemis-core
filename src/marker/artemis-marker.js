import {ARTEMIS_CLASS} from '../common/common-constants';

export class Marker {

	constructor(settings){
    this._settings = settings;
	}

  addColorClassesToHtmlDocHead() {
    let uniqueColor = this._settings.colors["single-match-color"];
    let css = `.${ARTEMIS_CLASS}0{background-color: ${uniqueColor}; outline: 1px solid ${uniqueColor};}`;
    this._settings.colors["score-colors"].forEach((item,i) => {
      css += `.${ARTEMIS_CLASS}${i+1}{background-color: ${item.color}; outline: 1px solid ${item.color};}`;
    });
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    document.getElementsByTagName('head')[0].appendChild(style);
  }

	mark(scoringResult) {
    let arrColor = this._settings.colors["score-colors"];
    for (let elm of scoringResult.elements) {
      if (scoringResult.hasSingleMatch && elm.score === 1) {
        elm.colorClassIndex = 0;
      } else {
        arrColor.forEach((item,i) => {
          if (elm.colorClass === "" && elm.score >= item.value){
              elm.colorClass = i+1;
          }
        });
      }
    }
	}

}
