export default class Element {

  constructor(id, domElm){
    this.id = id;
    this.domElm = domElm;
    this.htmlTagName = domElm.tagName.toLowerCase();
    this.score = 0;

    //this.classes = this.domElm.classList;
    //this.scoreAttr = '';
    //this.attrs = this.domElm.attributes;
    //this._weight = 0;
    //this._rect = this.getRect();
    //this.unique = false;
    //this._score = 0;
  }

  get id() {return this._id;}
  set id(value) {this._id = value;}

  get domElm() {return this._domElm;}
  set domElm(value) {this._domElm = value;}

  get htmlTagName() {return this._htmlTagName;}
  set htmlTagName(value) {this._htmlTagName = value;}

  get score() {return this._score;}
  set score(value) {this._score = value;}

  markScoreOnHtml() {
    this.domElm.setAttribute(ARTEMIS_SCORE_ATTR, score);
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

  removeAttributeScore(){
    this.domElm.removeAttribute(ARTEMIS_SCORE_ATTR);
    this.removeColorClassIndex();
  }
}
