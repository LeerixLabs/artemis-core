import {ScorerHelper} from './../scorer-helper';

export default class CssClassScorer {

  constructor(name, settings){
    this.name = name;
    this._settings = settings;
  }

  score(elm, value) {
    if (!elm.classList || elm.classList.length === 0 || !value) {
      return 0;
    }
    let classArray = [];
    for (let c=0; c < elm.classList.length; c++) {
      classArray.push(elm.classList.item(c));
    }
    return ScorerHelper.multiStringMatchScore(classArray, value, true);
  }

}
