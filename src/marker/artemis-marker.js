import Constants from '../common/common-constants';
import HtmlDOM from '../common/html-dom';
import {log} from '../common/logger';

export class Marker {

	constructor(settings){
    this._settings = settings;
	}

  _ensureColorClassesExistOnHtmlDom() {
    let htmlDom = new HtmlDOM();
    if (!htmlDom.artemisColorClassesExistOnHtmlDom) {
      let singleMatchColor = this._settings.colors['single-match-color'];
      let scoreColors = this._settings.colors['score-colors'];
      htmlDom.addColorClassesToHtmlDom(singleMatchColor, scoreColors);
      htmlDom.artemisColorClassesExistOnHtmlDom = true;
    }
  }

	mark(scoringResult) {
    log.debug('Marker.mark() - start');
    this._ensureColorClassesExistOnHtmlDom();

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
