import {ScorerHelper} from './../scorer-helper';

export default class ElmLocationScorer {

  constructor(name, settings){
    this.name = name;
    this._settings = settings;
    this._bodyRect = null;
  }

  score(elm, val) {
    //val can be top|bottom|left|right|middle
    if (!val || !elm) {
      return 0;
    }
    let rect = elm.rect;
    if (!rect || rect.width === 0 || rect.height === 0) {
      return 0;
    }
    if (!this._bodyRect) {
      this._bodyRect = elm.document && elm.document.body && elm.document.body.getBoundingClientRect();
    }
    if (!this._bodyRect) {
      return 0;
    }
    let score = 0;
    if (val === 'top') {
      score = 1 - ((rect.top + rect.bottom) / 2 / this._bodyRect.bottom);
    } else if (val === 'bottom') {
      score = (rect.top + rect.bottom) / 2 / this._bodyRect.bottom;
    } else if (val === 'left') {
      score = 1 - ((rect.left + rect.right) / 2 / this._bodyRect.right);
    } else if (val === 'right') {
      score = (rect.left + rect.right) / 2 / this._bodyRect.right;
    } else if (val === 'middle') {
      let maxScore = 0;
      maxScore = Math.max(maxScore, this.score(elm, 'top'));
      maxScore = Math.max(maxScore, this.score(elm, 'bottom'));
      maxScore = Math.max(maxScore, this.score(elm, 'left'));
      maxScore = Math.max(maxScore, this.score(elm, 'right'));
      score = 1 - maxScore;
    }
    score = score <= 0.6 ? 0 : (score - 0.6) * 2.5;
    return score;
  }

}

