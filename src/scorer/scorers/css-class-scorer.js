import {ScorerHelper} from './../scorer-helper';

export default class CssClassScorer {

  static score(param, elm) {
    return ScorerHelper.stringMatchScores(elem.classes, param, true);
  }

}
