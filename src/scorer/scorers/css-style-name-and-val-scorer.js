import {ScorerHelper} from './../scorer-helper';

export default class CssStyleNameAndValScorer {

  constructor(name, settings){
    this.name = name;
    this._settings = settings;
    this._window = null;
  }

  score(elm, val) {
    //val should be an array of css style name and css style value
    if (!elm || !elm.window || !val || val.length !== 2) {
      return 0;
    }
    let score = 0;
    let computedStyle = elm.window.getComputedStyle(elm.domElm);
    if (computedStyle[val[0]] && computedStyle[val[0]] === val[1]) {
      score = 1;
    }
    return score;
  }

}
