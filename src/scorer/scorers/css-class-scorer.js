import ScorerHelper from './../scorer-helper';

export default class CssClassScorer {

  static score(param, elem){
    return ParamAnalyze.stringMatchScores(elem.classes, param, true);
  }

}
