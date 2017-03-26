import ScorerHelper from './../scorer-helper';

export default class HtmlAttrNameScorer {

  constructor(name, settings){
    this.name = name;
    this._settings = settings;
  }

  score(elm, val){
    if (!val || !elm || !elm.attributes || elm.attributes.length === 0) {
      return 0;
    }
    let score;
    let attrNames = [];
    for (let i = 0; i < elm.attributes.length; i++) {
      attrNames.push(elm.attributes[i].name);
    }
    score = ScorerHelper.multiStringMatchScore(attrNames, val, true);
    return score;
  }

}
