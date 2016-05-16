import Constants from './common-constants';

export default class Element {

  constructor(id, domElm){
    this._id = id;
    this._domElm = domElm;
    this._score = 0;
  }

  get id() {return this._id;}
  set id(value) {this._id = value;}

  get domElm() {return this._domElm;}
  set domElm(value) {this._domElm = value;}

  get tagName() {return this._domElm.tagName.toLowerCase();}

  get classList() {return this._domElm.classList;}

  get attributes() {return this._domElm.attributes;}

  get score() {return this._score;}
  set score(value) {this._score = value;}

  get rect() { return this._domElm.getBoundingClientRect() }

  markIdOnHtmlDom() {
    this._domElm.setAttribute(Constants.artemisIdAttr, '' + this.id);
  }

  markScoreOnHtmlDom() {
    this._domElm.setAttribute(Constants.artemisScoreAttr, '' + this.score);
  }

  reportData() {
    return {
      id: this.id,
      tag: this.tagName,
      score: this.score
    }
  }

  //getRect() {
  //  let rectElm = this.domElm.getBoundingClientRect();
  //  rectElm.topPage = rectElm.top + window.scrollY;
  //  rectElm.bottomPage = rectElm.bottom + window.scrollY;
  //  rectElm.leftPage = rectElm.left + window.scrollX;
  //  rectElm.rightPage = rectElm.right + window.scrollX;
  //  return rectElm;
  //}

  //use: elem.artemisClass
  get colorClassIndex() {
    for(let classElem of this.classes){
      if(classElem.includes(ARTEMIS_CLASS)){
        return classElem;
      }
    }
    return '';
  }

  //use: elem.artemisClass = "red";
  set colorClassIndex(colorClassIndex) {
    this.classes.add(`${ARTEMIS_CLASS}${colorClassIndex}`);
  }

  removeColorClassIndex(){
    for(let classElem of this.classes){
      if(classElem.includes(ARTEMIS_CLASS)){
        this.classes.remove(classElem);
      }
    }
  }

}
