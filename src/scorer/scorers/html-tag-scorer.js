export default class HtmlTagScorer {

  constructor(name, settings){
    this.name = name;
    this._settings = settings;
  }

  score(elm, value){
    if (value === '*') {
        return 1;
    } else {
        return value.toLowerCase() === elm.tagName.toLowerCase() ? 1 : 0;
    }
  }

}
