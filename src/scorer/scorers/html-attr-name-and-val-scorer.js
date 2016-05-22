import {ScorerHelper} from './../scorer-helper';

export default class HtmlAttrNameAndValScorer {

  constructor(name, settings){
    this.name = name;
    this._settings = settings;
  }

  score(elm, val){
    if (!elm || !elm.attributes || !val || val.length != 2) {
      return 0;
    }
    let score = 0;
    for (let i=0; i < elm.attributes.length; i++) {
      if (elm.attributes[i].name === val[0]) {
        score = ScorerHelper.stringMatchScore(elm.attributes[i].value, val[1], true);
        break;
      }
    }
    return score;
  }

}
