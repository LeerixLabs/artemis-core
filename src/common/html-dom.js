import Constants from './common-constants';

export default class HtmlDOM {

  constructor(){
    this.window = window;
    this.document = document;
    this.head = this.document.head;
    this.body = this.document.body;
    this._ignoredTags = ['script', 'noscript'];
  }

  _isDomElmVisible(domElm) {
    while (
      domElm.nodeName.toLowerCase() !== 'body'
      && this.window.getComputedStyle(domElm).display.toLowerCase() !== 'none'
      && this.window.getComputedStyle(domElm).visibility.toLowerCase() !== 'hidden') {
        domElm = domElm.parentNode;
    }
    return domElm.nodeName.toLowerCase() === 'body';
  }

  getRelevantDomElms() {
    let relevantDomElms = [];
    let allDomElms = this.body.getElementsByTagName('*');
    for (let i = 0; i < allDomElms.length; i++) {
      let de = allDomElms[i];
      if (!this._ignoredTags.includes(de.tagName.toLowerCase()) && this._isDomElmVisible(de)) {
        relevantDomElms.push(de);
      }
    }
    return relevantDomElms;
  }

  _hasArtemisAttr(attrName) {
    return this.body.hasAttribute(attrName);
  }

  _setArtemisAttr(attrName, value) {
    if (value) {
      this.body.setAttribute(attrName, 'true');
    } else {
      this.body.removeAttribute(attrName);
    }
  }

  get artemisColorClassesExistOnHtmlDom() { return this._hasArtemisAttr(Constants.artemisColorClassesExistAttr); }
  set artemisColorClassesExistOnHtmlDom(value) { this._setArtemisAttr(Constants.artemisColorClassesExistAttr, value); }

  get artemisElmIdsExistOnHtmlDom() { return this._hasArtemisAttr(Constants.artemisElmIdsExistAttr); }
  set artemisElmIdsExistOnHtmlDom(value) { this._setArtemisAttr(Constants.artemisElmIdsExistAttr, value); }

  get artemisElmScoresExistOnHtmlDom() { return this._hasArtemisAttr(Constants.artemisElmScoresExistAttr); }
  set artemisElmScoresExistOnHtmlDom(value) { this._setArtemisAttr(Constants.artemisElmScoresExistAttr, value); }

  get artemisElmClassesExistOnHtmlDom() { return this._hasArtemisAttr(Constants.artemisElmClassesExistAttr); }
  set artemisElmClassesExistOnHtmlDom(value) { this._setArtemisAttr(Constants.artemisElmClassesExistAttr, value); }

  _cleanElmIdsFromHtmlDom(domElms) {
    if (this.artemisElmIdsExistOnHtmlDom) {
      domElms.forEach(de => {
        de.removeAttribute(Constants.artemisElmIdAttr);
      });
      this.artemisElmIdsExistOnHtmlDom = false;
    }
  }

  _cleanElmScoresFromHtmlDom(domElms) {
    if (this.artemisElmScoresExistOnHtmlDom) {
      domElms.forEach(de => {
        de.removeAttribute(Constants.artemisElmScoreAttr);
      });
      this.artemisElmScoresExistOnHtmlDom = false;
    }
  }

  _cleanElmClassesFromHtmlDom(domElms) {
    if (this.artemisElmClassesExistOnHtmlDom) {
      domElms.forEach(de => {
        let artemisClassName = '';
        for (let i = 0; i < de.classList.length; i++) {
          if (artemisClassName) {
            break;
          }
          if (de.classList.item(i).indexOf(Constants.artemisElmClassPrefix) === 0) {
            artemisClassName = de.classList.item(i);
          }
        }
        if (artemisClassName) {
          de.classList.remove(artemisClassName);
        }
      });
      this.artemisElmClassesExistOnHtmlDom = false;
    }
  }

  cleanDom(force) {
    if (force || this.artemisElmIdsExistOnHtmlDom || this.artemisElmScoresExistOnHtmlDom || this.artemisElmClassesExistOnHtmlDom) {
      let domElms = this.getRelevantDomElms();
      this._cleanElmIdsFromHtmlDom(domElms);
      this._cleanElmScoresFromHtmlDom(domElms);
      this._cleanElmClassesFromHtmlDom(domElms);
    }
  }

  addColorClassesToHtmlDom(singleMatchColor, singleMatchTextColor, scoreColors, scoreTextColors) {
    let colorClassesText = [];
    for (let i = 0; i < scoreColors.length; i++) {
      colorClassesText.push(`.${Constants.artemisElmClassPrefix}${i} {background-color: ${scoreColors[i]} !important; background-image: none !important; outline: 1px solid ${scoreColors[i]} !important; color: ${scoreTextColors[i]} !important; fill: ${scoreTextColors[i]} !important;}`);
    }
    colorClassesText.push(`.${Constants.artemisElmClassPrefix}${Constants.artemisElmClassSingleMatchSuffix} {background-color: ${singleMatchColor} !important; background-image: none !important; outline: 1px solid ${singleMatchColor} !important; color: ${singleMatchTextColor} !important; fill: ${singleMatchTextColor} !important;}`);
    let style = this.document.createElement('style');
    style.type = 'text/css';
    style.id = Constants.artemisStyleId;
    let cssText = colorClassesText.join('\n');
    if (style.styleSheet) {
      style.styleSheet.cssText = cssText;
    } else {
      style.appendChild(this.document.createTextNode(cssText));
    }
    this.head.appendChild(style);
  }

  static markElmIdOnHtmlDom(domElm, id) {
    domElm.setAttribute(Constants.artemisElmIdAttr, '' + id);
  }

  static markElmScoreOnHtmlDom(domElm, score) {
    domElm.setAttribute(Constants.artemisElmScoreAttr, '' + score);
  }

  static addElmClassToHtmlDom(domElm, className) {
    domElm.classList.add(className);
  }

}
