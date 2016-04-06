import {IGNORED_TAGS} from '../common/common-constants';

export class HtmlDOM {

  constructor(){
    this.console = console;
    this.window = window;
    this.document = document;
    this.head = this.document.head;
    this.body = this.document.body;
    this.bodyRect = this.getRect();
  }

  getRect() {
    let rectElm = this.body.getBoundingClientRect();
    rectElm.topPage = rectElm.top + window.scrollY;
    rectElm.bottomPage = rectElm.bottom + window.scrollY;
    rectElm.leftPage = rectElm.left + window.scrollX;
    rectElm.rightPage = rectElm.right + window.scrollX;
    return rectElm;
  }

  getAllDomElms() {
    return this.body.getElementsByTagName('*');
  }

  getRelevantElms() {
    let relevantElms = [];
    let allDomElms = this.getAllDomElms();
    for (var i = 0; i < allDomElms.length; i++) {
      if (this.isRelevantElm(allDomElms[i])) {
        let elm = new Element(i, allDomElms[i]);
        elm.removeAttributeScore();
        relevantElms.push(elm);
      }
    }
    return relevantElms;
  }

  isRelevantElm(domElm){
    return !IGNORED_TAGS.includes(domElm.tagName.toLowerCase()) && this.isDomElmVisible(domElm);
  }

  isDomElmVisible(domElm) {
    while (domElm.nodeName.toLowerCase() !== 'body' && this.window.getComputedStyle(domElm).display.toLowerCase() !== 'none' && this.window.getComputedStyle(domElm).visibility.toLowerCase() !== 'hidden') {
      domElm = domElm.parentNode;
    }
    return domElm.nodeName.toLowerCase() === 'body';
  }
}
