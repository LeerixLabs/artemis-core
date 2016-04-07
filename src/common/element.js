import {ARTEMIS_SCORE_ATTR} from './common-constants';
import {ARTEMIS_CLASS} from './common-constants';

export class Element {

  constructor(id, domElm){
    this.domElm = domElm;
    this.idIntenal = id;
    this.tagName = this.domElm.tagName.toLowerCase();
    this.classes = this.domElm.classList;
    this.scoreAttr = '';
    this.attrs = this.domElm.attributes;
    this._weight = 0;
    this._rect = this.getRect();
    this.unique = false;
  }

  //return position rectangle element; use: elem.rect
  get rect() {
    return this._rect;
  }

  getRect() {
    let rectElm = this.domElm.getBoundingClientRect();
    rectElm.topPage = rectElm.top + window.scrollY;
    rectElm.bottomPage = rectElm.bottom + window.scrollY;
    rectElm.leftPage = rectElm.left + window.scrollX;
    rectElm.rightPage = rectElm.right + window.scrollX;
    return rectElm;
  }

  //use: elem.score
  get score() {
    if(this.domElm.hasAttribute(ARTEMIS_SCORE_ATTR)){
      return this.domElm.getAttribute(ARTEMIS_SCORE_ATTR);
    }
    return 0;
  }

  //use: elem.score = 0.2;
  set score(score) {
    this.domElm.setAttribute(ARTEMIS_SCORE_ATTR, score);
  }

  //use: elem.weight
  get weight() {
    return this._weight;
  }

  //use: elem.weight = 0.2;
  set weight(score) {
    this._weight = score;
  }

  //use: elem.artemisClass
  get colorClass() {
    for(let classElem of this.classes){
      if(classElem.includes(ARTEMIS_CLASS)){
        return classElem;
      }
    }
    return '';
  }

  //use: elem.artemisClass = "red";
  set colorClass(colorClass) {
    this.classes.add(`${ARTEMIS_CLASS}${colorClass}`);
  }

  removeColorClass(){
    for(let classElem of this.classes){
      if(classElem.includes(ARTEMIS_CLASS)){
        this.classes.remove(classElem);
      }
    }
  }

  removeAttributeScore(){
    this.domElm.removeAttribute(ARTEMIS_SCORE_ATTR);
    this.removeColorClass();
  }
}
