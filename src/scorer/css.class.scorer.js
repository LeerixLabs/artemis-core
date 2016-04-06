import {ParamAnalyze} from './artemis-paramanalyze';

export default class CssClassScorer {

    scorer(param,elem){ 
       return ParamAnalyze.stringMatchScores(elem.classes, param, true);
    }
}