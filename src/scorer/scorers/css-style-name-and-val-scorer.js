import {ScorerHelper} from './../scorer-helper';

export default class CssStyleNameAndValScorer {

  constructor(name, settings){
    this.name = name;
    this._settings = settings;
  }

  score(elm, val) {
    return 0;
  }

}
