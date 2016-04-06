import {ParamAnalyze} from './artemis-paramanalyze';

export default class ElementAttributeValueScorer {

    scorer(param,elem){
        let  attrs = [];
        for (var i = 0; i < elem.attrs.length; i++) {
            attrs.push(elem.attrs[i].value);
        }
        return ParamAnalyze.stringMatchScores(attrs, param, true);;
    }
}