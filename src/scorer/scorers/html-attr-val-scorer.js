import ScorerHelper from './../scorer-helper';

export default class HtmlAttrValScorer {

  constructor(name, settings){
    this.name = name;
    this._settings = settings;
  }

  score(elm, val){
    if (!val || !elm || !elm.attributes || elm.attributes.length === 0) {
      return 0;
    }
    let score;
    let attrValues = [];
    for (let i = 0; i < elm.attributes.length; i++) {
      attrValues.push(elm.attributes[i].value);
    }
    score = ScorerHelper.multiStringMatchScore(attrValues, val, true);
    return score;
  }

}
