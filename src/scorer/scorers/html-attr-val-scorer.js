import ScorerHelper from './../scorer-helper';

export default class ElementAttributeValueScorer {

  static score(param,elem){
      let  attrs = [];
      for (var i = 0; i < elem.attrs.length; i++) {
          attrs.push(elem.attrs[i].value);
      }
      return ParamAnalyze.stringMatchScores(attrs, param, true);
  }

}
