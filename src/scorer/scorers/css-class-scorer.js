import {ScorerHelper} from './../scorer-helper';

export default class CssClassScorer {

  score(param, elm) {
    return ScorerHelper.stringMatchScores(elm.classes, param, true);
  }

}
