export default class HtmlTagScorer {

  constructor(name, settings){
    this.name = name;
    this._settings = settings;
  }

  score(elm, tagName){
    if (tagName === '*') {
        return 1;
    } else {
        return tagName.toLowerCase() === elm.tagName.toLowerCase() ? 1 : 0;
    }
  }

}
