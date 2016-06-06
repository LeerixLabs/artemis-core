import {ScorerHelper} from './../scorer-helper';

export default class ElmLocationScorer {

  constructor(name, settings){
    this.name = name;
    this._settings = settings;
    this._locationType = {
      TOP: 'top',
      BOTTOM: 'bottom',
      LEFT: 'left',
      RIGHT: 'right',
      MIDDLE: 'middle',
      UNKNOWN: 'unknown'
    };
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
    let bodyRect = elm.document && elm.document.body && elm.document.body.getBoundingClientRect();
    if (!bodyRect) {
      return 0;
    }
    let score = 0;
    let locationType = this._locationType[val.toUpperCase()] || this._locationType.UNKNOWN;
    if (locationType === this._locationType.TOP) {
      score = 1 - ((rect.top + rect.bottom) / 2 / bodyRect.bottom);
    } else if (locationType === this._locationType.BOTTOM) {
      score = (rect.top + rect.bottom) / 2 / bodyRect.bottom;
    } else if (locationType === this._locationType.LEFT) {
      score = 1 - ((rect.left + rect.right) / 2 / bodyRect.right);
    } else if (locationType === this._locationType.RIGHT) {
      score = (rect.left + rect.right) / 2 / bodyRect.right;
    } else if (locationType === this._locationType.MIDDLE) {
      let maxScore = 0;
      maxScore = Math.max(maxScore, this.score(elm, this._locationType.TOP));
      maxScore = Math.max(maxScore, this.score(elm, this._locationType.BOTTOM));
      maxScore = Math.max(maxScore, this.score(elm, this._locationType.LEFT));
      maxScore = Math.max(maxScore, this.score(elm, this._locationType.RIGHT));
      score = 1 - maxScore;
    }
    score = score <= 0.6 ? 0 : (score - 0.6) * 2.5;
    return score;
  }

}

