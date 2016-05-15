export default class HtmlTagScorer {

  constructor(name, settings){
    this.name = name;
    this._settings = settings;
  }

  score(param, elm){
    if (param === "element"){
        return 1;
    } else {
        return param.toLowerCase() === elm.domElm.tagName.toLowerCase() ? 1 : 0;
    }
  }

}
