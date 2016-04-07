import {ScorerHelper} from './../scorer-helper';

export default class TextScorer {

    score(param, elm){
        return ScorerHelper.stringMatchScores([elm.domElm.text, elm.domElm.value, elm.domElm.innerText, elm.domElm.textContent], param, true);
    }
}
