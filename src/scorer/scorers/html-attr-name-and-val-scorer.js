import {ScorerHelper} from './../scorer-helper';

export default class HtmlAttrNameAndValScorer {

  constructor(name, settings){
    this.name = name;
    this._settings = settings;
  }

  score(elm, attrNameAndVal){
    let score = 0;
    for (let i=0; i < elm.attributes.length; i++) {
      if (elm.attributes[i].name === attrNameAndVal[0]) {
        score = ScorerHelper.stringMatchScore(elm.attributes[i].value, attrNameAndVal[1]);
        break;
      }
    }
    return score;
  }

}
