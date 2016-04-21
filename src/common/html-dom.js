import {IGNORED_TAGS} from './common-constants';

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
    rectElm.topPage = rectElm.top + this.window.scrollY;
    rectElm.bottomPage = rectElm.bottom + this.window.scrollY;
    rectElm.leftPage = rectElm.left + this.window.scrollX;
    rectElm.rightPage = rectElm.right + this.window.scrollX;
    return rectElm;
  }

  getAllDomElms() {
    return this.body.getElementsByTagName('*');
  }

  getRelevantDomElms() {
    let relevantDomElms = [];
    let allDomElms = this.getAllDomElms();
    for (let i = 0; i < allDomElms.length; i++) {
      if (this.isRelevantElm(allDomElms[i])) {
        relevantDomElms.push(allDomElms[i]);
      }
    }
    return relevantDomElms;
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
