export default class HtmlAttrNameAndValScorer {

  constructor(name, settings){
    this.name = name;
    this._settings = settings;
  }

  score(param, elm){
    for (let i=0; i<elm.attrs.length; i++) {
      if (elm.attrs[i]["name"] === param[0] &&  elm.attrs[i]["value"] === param[1]) {
        return 1;
      }
    }
    return 0;
  }

}
