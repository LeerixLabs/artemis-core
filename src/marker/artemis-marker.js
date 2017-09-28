import Constants from '../common/common-constants';
import HtmlDOM from '../common/html-dom';
import {log} from '../common/logger';

export default class Marker {

	constructor(settings, htmlDom){
		this._settings = settings;
		//this._singleMatchColor = "#0079EF";
		//this._scoreColors = ["#FFFFCC", "#FFFFAA", "#FFFF99", "#FFFF66", "#FFFF33", "#FFFF00", "#FFCC00", "#FFAA00", "#FF9900", "#FF6600", "#FF3300"];
		this._singleMatchColor = this._settings.colors.singleMatchColor;
		//this._singleMatchTextColor = this._getTextColor(this._singleMatchColor);
		this._multiMatchColor = this._settings.colors.multiMatchColor;
		//this._multiMatchTextColor = this._getTextColor(this._multiMatchColor);
		this._htmlDom = htmlDom;
		this._isDebug = log.isDebug();
	}

	// _getBrightness(colorHex) {
	// 	let r = parseInt(colorHex.substring(1, 3), 16);
	// 	let g = parseInt(colorHex.substring(3, 5), 16);
	// 	let b = parseInt(colorHex.substring(5, 7), 16);
	// 	let brightness = Math.sqrt(r * r * .241 + g * g * .691 + b * b * .068);
	// 	return brightness|0;
	// }

	// _getTextColor(colorHex) {
	// 	let brightness = this._getBrightness(colorHex);
	// 	return brightness >= 128 ? '#000000' : '#FFFFFF';
	// }

	_ensureColorClassesExistOnHtmlDom() {
		if (!this._htmlDom.artemisColorClassesExistOnHtmlDom) {
			this._htmlDom.addColorClassesToHtmlDom(this._singleMatchColor, this._multiMatchColor);
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
			if (elm.primaryScore === 1) {
				className = `${Constants.artemisElmClassPrefix}${(perfectScoreCount === 1) ? Constants.artemisElmClassSingleMatchSuffix : Constants.artemisElmClassMultiMatchSuffix}`;
				HtmlDOM.addElmClassToHtmlDom(elm.domElm, className);
			}
		});
		this._htmlDom.artemisElmClassesExistOnHtmlDom = true;
		if (this._isDebug){log.debug('Marker.mark() - end')}
	}

	markEverything() {
		if (this._isDebug){log.debug('Marker.markAll() - start')}
		this._ensureColorClassesExistOnHtmlDom();
		let className = `${Constants.artemisElmClassPrefix}${Constants.artemisElmClassMultiMatchSuffix}`;
		let domElms = this._htmlDom.getRelevantDomElms();
		domElms.forEach(domElm => {
			HtmlDOM.addElmClassToHtmlDom(domElm, className);
		});
		this._htmlDom.artemisElmClassesExistOnHtmlDom = true;
		if (this._isDebug){log.debug('Marker.markAll() - end')}
	}

}
