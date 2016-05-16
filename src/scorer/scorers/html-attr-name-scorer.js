import {ScorerHelper} from './../scorer-helper';

export default class HtmlAttrNameScorer {

  constructor(name, settings){
    this.name = name;
    this._settings = settings;
  }

  score(elm, val){
    if (!elm || !elm.attributes || elm.attributes.length === 0 || !val) {
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
