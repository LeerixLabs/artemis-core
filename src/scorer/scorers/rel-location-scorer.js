import {REL_LOCATION_TYPE} from '../../constants';

export default class RelPositionScorer {

    static get name() {
        return "target-relation";
    }

    score(param,elem, comparingElement, bodyRect){
        let elmRect1 = elem.rect;
        let elmRect2 = comparingElement.rect;
        let score = 0;

        if (param === REL_LOCATION_TYPE.RIGHT_OF) {
            if ((elmRect1.leftPage >= elmRect2.rightPage) &&
                (elmRect1.topPage < elmRect2.bottomPage) &&
                (elmRect1.bottomPage > elmRect2.topPage)) {
                score = this.getPartialScore(elmRect1.leftPage - elmRect2.rightPage, bodyRect.rightPage, true);
            }
        } else
         if (param === REL_LOCATION_TYPE.LEFT_OF) {
            if ((elmRect2.leftPage >= elmRect1.rightPage) &&
                (elmRect2.topPage < elmRect1.bottomPage) &&
                (elmRect2.bottomPage > elmRect1.topPage)) {
                score = this.getPartialScore(elmRect2.leftPage - elmRect1.rightPage, bodyRect.rightPage, true);
            }
        } else if (param === REL_LOCATION_TYPE.BELOW) {
            if ((elmRect1.topPage >= elmRect2.bottomPage) &&
                (elmRect1.leftPage < elmRect2.rightPage) &&
                (elmRect1.rightPage > elmRect2.leftPage)) {
                score = this.getPartialScore(elmRect1.bottomPage - elmRect2.topPage, bodyRect.bottomPage, true);
            }
        } else if (param === REL_LOCATION_TYPE.ABOVE) {
            if ((elmRect2.topPage >= elmRect1.bottomPage) &&
                (elmRect2.leftPage < elmRect1.rightPage) &&
                (elmRect2.rightPage > elmRect1.leftPage)) {
                score = this.getPartialScore(elmRect2.bottomPage - elmRect1.topPage, bodyRect.bottomPage, true);
            }
        } else if (param === REL_LOCATION_TYPE.NEAR) {
            var deltaX = Math.abs( (elmRect1.left + (elmRect1.right - elmRect1.left)/2) - (elmRect2.left + (elmRect2.right - elmRect2.left)/2) );
            var deltaY = Math.abs( (elmRect1.top + (elmRect1.bottom - elmRect1.top)/2) - (elmRect2.top + (elmRect2.bottom - elmRect2.top)/2) );
            var dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
            var maxDist = Math.sqrt(Math.pow(300, 2) + Math.pow(300, 2));
            score = getPartialScore(dist, maxDist, true);
        } else if (param === REL_LOCATION_TYPE.INSIDE) {
            if ((elmRect1.left >= elmRect2.left) &&
                (elmRect1.top >= elmRect2.top) &&
                (elmRect1.right <= elmRect2.right) &&
                (elmRect1.bottom <= elmRect2.bottom))
            {
                score = 1;
            }
        }   
        return score;
    }

    getPartialScore(value, maxValue, reversed) {
        var score = maxValue > 0 ? Math.min(Math.max(0, value / maxValue), 1.0) : 0;
        return reversed ? 1 - score : score;
    }

}
