export default class HtmlAttrNameAndValScorer {

  constructor(name, settings){
    this.name = name;
    this._settings = settings;
  }

  score(elm, value){
    for (let i=0; i < elm.attributes.length; i++) {
      if (elm.attributes[i]["name"] === value[0] &&  elm.attributes[i]["value"] === value[1]) {
        return 1;
      }
    }
    return 0;
  }

}
