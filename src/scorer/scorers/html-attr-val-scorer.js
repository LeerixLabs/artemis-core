import {ScorerHelper} from './../scorer-helper';

export default class HtmlAttrValScorer {

  score(param, elm){
      let  attrs = [];
      for (var i = 0; i < elm.attrs.length; i++) {
          attrs.push(elm.attrs[i].value);
      }
      return ScorerHelper.stringMatchScores(attrs, param, true);
  }

}
