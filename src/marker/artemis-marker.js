import Constants from '../common/common-constants';
import {log} from '../common/logger';

export class Marker {

	constructor(settings){
    this._settings = settings;
	}

  addColorClassesToHtmlDocHead() {
    //let cssColorClasses = [];
    //for (let i = 0; i < colors.length; i++) {
    //  cssColorClasses.push('.' + Constants.artemisClassPrefix + i + ' {background-color: ' + colors[i] + ' !important; outline: 5px solid ' + colors[i] + ' !important;}');
    //}
    //_.forEach(cssClasses, function(cssClass) {
    //  addClassToHtmlDom(cssClass);
    //});
    //
    //
    //
    //let singleMatchColor = this._settings.colors["single-match-color"];
    //let css = `.${ARTEMIS_CLASS}0{background-color: ${singleMatchColor} !important; outline: 5px solid ${singleMatchColor} !important;}`;
    //this._settings.colors["score-colors"].forEach((item,i) => {
    //  css += `.${ARTEMIS_CLASS}${i+1}{background-color: ${item.color} !important; outline: 5px solid ${item.color} !important;}`;
    //});
    //let style = document.createElement('style');
    //style.type = 'text/css';
    //style.innerHTML = css;
    //document.getElementsByTagName('head')[0].appendChild(style);
  }

	mark(scoringResult) {
    log.debug('Marker.mark() - start');
    //let arrColor = this._settings.colors["score-colors"];
    //for (let elm of scoringResult.elements) {
    //  if (scoringResult.hasSingleMatch && elm.score === 1) {
    //    elm.colorClassIndex = 0;
    //  } else {
    //    arrColor.forEach((item,i) => {
    //      if (elm.colorClassIndex === "" && elm.score >= item.value){
    //          elm.colorClassIndex = i+1;
    //      }
    //    });
    //  }
    //}
    log.debug('Marker.mark() - end');
	}

}
