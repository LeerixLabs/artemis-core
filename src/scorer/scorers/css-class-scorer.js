import {ScorerHelper} from './../scorer-helper';

export default class CssClassScorer {

  constructor(name, settings){
    this.name = name;
    this._settings = settings;
  }

  score(elm, cls) {
    if (!elm.classList || elm.classList.length === 0 || !cls) {
      return 0;
    }
    let elmClassArray = [];
    for (let c=0; c < elm.classList.length; c++) {
      elmClassArray.push(elm.classList.item(c));
    }
    return ScorerHelper.multiStringMatchScore(elmClassArray, cls, true);
  }

}
