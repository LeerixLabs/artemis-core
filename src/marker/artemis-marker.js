import Constants from '../common/common-constants';
import HtmlDOM from '../common/html-dom';
import {log} from '../common/logger';

export default class Marker {

	constructor(settings, htmlDom){
		this._settings = settings;
		this._htmlDom = htmlDom;
		this._isDebug = log.isDebug();
	}

	_ensureColorClassesExistOnHtmlDom() {
		if (!this._htmlDom.artemisColorClassesExistOnHtmlDom) {
			let singleMatchColor = this._settings.colors.singleMatchColor;
			let scoreColors = this._settings.colors.scoreColors;
			this._htmlDom.addColorClassesToHtmlDom(singleMatchColor, scoreColors);
			this._htmlDom.artemisColorClassesExistOnHtmlDom = true;
		}
	}

	mark(scoringResult) {
		if (this._isDebug){log.debug('Marker.mark() - start')}
		this._ensureColorClassesExistOnHtmlDom();
		let perfectScoreCount = 0;
		scoringResult.elements.forEach(elm => {
			if (elm.primaryScore === 1) {
				perfectScoreCount++;
			}
		});
		if (this._isDebug){log.debug('perfectScoreCount: ${perfectScoreCount}')}
		let className = '';
		scoringResult.elements.forEach(elm => {
			if (elm.primaryScore === 1 &&  perfectScoreCount === 1) {
				className = `${Constants.artemisElmClassPrefix}${Constants.artemisElmClassSingleMatchSuffix}`;
			} else {
				className = `${Constants.artemisElmClassPrefix}${(elm.primaryScore*20|0)}`;
			}
			HtmlDOM.addElmClassToHtmlDom(elm.domElm, className);
		});
		this._htmlDom.artemisElmClassesExistOnHtmlDom = true;
		if (this._isDebug){log.debug('Marker.mark() - end')}
	}

}
