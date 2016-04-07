import {ScorerHelper} from './../scorer-helper';

export default class FreeTextScorer {

    score(param, elm){
        return ScorerHelper.stringMatchScores([elm.domElm.text, elm.domElm.value, elm.domElm.innerText, elm.domElm.textContent], param, true);
    }
}
