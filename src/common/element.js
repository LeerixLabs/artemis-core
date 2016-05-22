import HtmlDOM from './html-dom';

export default class Element {

  constructor(id, domElm) {
    this._id = id;
    this._score = 0;
    this._domElm = domElm;
  }

  get id() {return this._id;}
  set id(value) {this._id = value;}

  get score() {return this._score;}
  set score(value) {this._score = value;}

  get domElm() {return this._domElm;}
  set domElm(value) {this._domElm = value;}

  get document() { return this._domElm && this._domElm.ownerDocument;}

  get window() { return this.document && this.document.defaultView || this.document && this.document.parentWindow;}

  get tagName() {return this._domElm && this._domElm.tagName.toLowerCase();}

  get classList() {return this._domElm && this._domElm.classList;}

  get attributes() {return this._domElm && this._domElm.attributes;}

  get rect() { return this._domElm && this._domElm.getBoundingClientRect() }

  reportData() {
    return {
      id: this.id,
      tag: this.tagName,
      score: this.score,
      domElm: this.domElm
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
  //
  //get colorClassIndex() {
  //  for(let classElem of this.classes){
  //    if(classElem.includes(ARTEMIS_CLASS)){
  //      return classElem;
  //    }
  //  }
  //  return '';
  //}
  //
  //set colorClassIndex(colorClassIndex) {
  //  this.classes.add(`${ARTEMIS_CLASS}${colorClassIndex}`);
  //}
  //
  //removeColorClassIndex(){
  //  for(let classElem of this.classes){
  //    if(classElem.includes(ARTEMIS_CLASS)){
  //      this.classes.remove(classElem);
  //    }
  //  }
  //}

}
