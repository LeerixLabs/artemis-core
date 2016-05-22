import {ScorerHelper} from './../scorer-helper';

export default class CssClassScorer {

  constructor(name, settings){
    this.name = name;
    this._settings = settings;
  }

  score(elm, val) {
    //val can be a single class name or an array of class names
    if (!elm || !elm.classList || elm.classList.length === 0 || !val) {
      return 0;
    }
    let score;
    let elmClassArray = [];
    for (let c=0; c < elm.classList.length; c++) {
      elmClassArray.push(elm.classList.item(c));
    }
    score = ScorerHelper.multiStringMatchScore(elmClassArray, val, true);
    return score;
  }

}
