
import {ParamAnalyze} from './../artemis-paramanalyze';

export default class TextScorer {

    scorer(param,elem){
        return ParamAnalyze.stringMatchScores([elem.domElm.text, elem.domElm.value, elem.domElm.innerText, elem.domElm.textContent], param, true);
    }
}
