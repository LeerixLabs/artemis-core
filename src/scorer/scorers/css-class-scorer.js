import {ScorerHelper} from './../scorer-helper';

export default class CssClassScorer {

  constructor(name, settings){
    this.name = name;
    this._settings = settings;
  }

  score(elm, value) {
    let searchForClassNames = [];
    let scoreArray = [];
    let c;
    if (!elm.classList || elm.classList.length === 0) {
      return 0;
    }
    if (ScorerHelper.isArray(value)) {
      searchForClassNames = value;
    } else {
      searchForClassNames = [value];
    }
    searchForClassNames.forEach( searchForClassName => {
      for (c=0; c < elm.classList.length; c++) {
        scoreArray.push(ScorerHelper.stringMatchScore(elm.classList.item(c), searchForClassName, true));
      }
    });
    return ScorerHelper.getMaxScore(scoreArray);
  }

}
