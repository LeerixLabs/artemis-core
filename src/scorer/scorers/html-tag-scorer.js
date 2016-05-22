export default class HtmlTagScorer {

  constructor(name, settings){
    this.name = name;
    this._settings = settings;
  }

  score(elm, val){
    if (!val || !elm || !elm.tagName) {
      return 0;
    }
    if (val === '*') {
        return 1;
    } else {
        return val.toLowerCase() === elm.tagName.toLowerCase() ? 1 : 0;
    }
  }

}
