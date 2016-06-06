import {ScorerHelper} from './../scorer-helper';

export default class RelPositionScorer {

    constructor(name, settings){
        this.name = name;
        this._settings = settings;
        this._relPositionType = {
            ABOVE: 'above',
            BELOW: 'below',
            LEFT: 'left',
            RIGHT: 'right',
            INSIDE: 'inside',
            NEAR: 'near',
            UNKNOWN: 'unknown'
        };
    }

    score(elm1, elm2, val){
      //val can be above|below|left|right|inside|near
      if (!val || !elm1 || !elm2) {
          return 0;
      }
      let elmRect1 = elm1.rect;
      let elmRect2 = elm2.rect;
      if (!elm1.rect || !elm2.rect) {
          return 0;
      }
      let score = 0;
      let bodyRect = elm1.document && elm1.document.body && elm1.document.body.getBoundingClientRect();
      if (!bodyRect) {
        return 0;
      }
      if (val === this._relPositionType.ABOVE) {
         if ((elmRect2.top >= elmRect1.bottom) &&
             (elmRect2.left < elmRect1.right) &&
             (elmRect2.right > elmRect1.left)) {
             score = ScorerHelper.getPartialScore(elmRect2.bottom - elmRect1.top, bodyRect.bottom, true);
         }
      } else if (val === this._relPositionType.BELOW) {
          if ((elmRect1.top >= elmRect2.bottom) &&
            (elmRect1.left < elmRect2.right) &&
            (elmRect1.right > elmRect2.left)) {
              score = ScorerHelper.getPartialScore(elmRect1.bottom - elmRect2.top, bodyRect.bottom, true);
          }
      } else if (val === this._relPositionType.LEFT) {
          if ((elmRect2.left >= elmRect1.right) &&
            (elmRect2.top < elmRect1.bottom) &&
            (elmRect2.bottom > elmRect1.top)) {
              score = ScorerHelper.getPartialScore(elmRect2.left - elmRect1.right, bodyRect.right, true);
          }
      } else if (val === this._relPositionType.RIGHT) {
         if ((elmRect1.left >= elmRect2.right) &&
             (elmRect1.top < elmRect2.bottom) &&
             (elmRect1.bottom > elmRect2.top)) {
             score = ScorerHelper.getPartialScore(elmRect1.leftPage - elmRect2.rightPage, bodyRect.rightPage, true);
         }
      } else if (val === this._relPositionType.INSIDE) {
         if ((elmRect1.left >= elmRect2.left) &&
             (elmRect1.top >= elmRect2.top) &&
             (elmRect1.right <= elmRect2.right) &&
             (elmRect1.bottom <= elmRect2.bottom)) {
             score = 1;
         }
      } else if (val === this._relPositionType.NEAR) {
          var deltaX = Math.abs((elmRect1.left + (elmRect1.right - elmRect1.left) / 2) - (elmRect2.left + (elmRect2.right - elmRect2.left) / 2));
          var deltaY = Math.abs((elmRect1.top + (elmRect1.bottom - elmRect1.top) / 2) - (elmRect2.top + (elmRect2.bottom - elmRect2.top) / 2));
          var dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
          var maxDist = Math.sqrt(Math.pow(300, 2) + Math.pow(300, 2));
          score = ScorerHelper.getPartialScore(dist, maxDist, true);
      }
      return score;
    }

}
