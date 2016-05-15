import {ScorerHelper} from './../scorer-helper';

export default class CssClassScorer {

  constructor(name, settings){
    this.name = name;
    this._settings = settings;
  }

  score(param, elm) {
    return ScorerHelper.stringMatchScores(elm.classes, param, true);
  }

}
