import Constants from './common-constants';

export default class HtmlDOM {

  constructor(){
    this.console = console;
    this.window = window;
    this.document = document;
    this.head = this.document.head;
    this.body = this.document.body;
    this.bodyRect = this.body.getBoundingClientRect();
    this._ignoredTags = ['script', 'noscript'];
  }

  isDomElmVisible(domElm) {
    while (domElm.nodeName.toLowerCase() !== 'body' && this.window.getComputedStyle(domElm).display.toLowerCase() !== 'none' && this.window.getComputedStyle(domElm).visibility.toLowerCase() !== 'hidden') {
      domElm = domElm.parentNode;
    }
    return domElm.nodeName.toLowerCase() === 'body';
  }

  getRelevantDomElms() {
    let relevantDomElms = [];
    let allDomElms = this.body.getElementsByTagName('*');
    for (let i = 0; i < allDomElms.length; i++) {
      let de = allDomElms[i];
      if (!this._ignoredTags.includes(de.tagName.toLowerCase()) && this.isDomElmVisible(de)) {
        relevantDomElms.push(de);
      }
    }
    return relevantDomElms;
  }

  cleanDom() {
    if (this.body.hasAttribute(Constants.artemisBodyAttr)) {
      let relevantDomElms = this.getRelevantDomElms();
      relevantDomElms.forEach(de => {
        de.removeAttribute(Constants.artemisIdAttr);
        de.removeAttribute(Constants.artemisScoreAttr);
        let artemisClassName = '';
        for (let i = 0; i < de.classList.length; i++) {
          if (!artemisClassName && de.classList.item(i).indexOf(Constants.artemisClassPrefix) === 0) {
            artemisClassName = de.classList.item(i);
          }
        }
        if (artemisClassName) {
          de.classList.remove(artemisClassName);
        }
      });
      this.body.removeAttribute(Constants.artemisBodyAttr);
    }
  }

  addArtemisBodyAttr() {
    this.body.setAttribute(Constants.artemisBodyAttr, 'true');
  }

  static addElmIdToHtmlDom(domElm, id) {
    domElm.setAttribute(Constants.artemisIdAttr, '' + id);
  }

  static addElmScoreToHtmlDom(domElm, score) {
    domElm.setAttribute(Constants.artemisScoreAttr, '' + score);
  }

  //getRect() {
  //  let rectElm = this.body.getBoundingClientRect();
  //  rectElm.topPage = rectElm.top + this.window.scrollY;
  //  rectElm.bottomPage = rectElm.bottom + this.window.scrollY;
  //  rectElm.leftPage = rectElm.left + this.window.scrollX;
  //  rectElm.rightPage = rectElm.right + this.window.scrollX;
  //  return rectElm;
  //}

}
