import ElementTagScorer from './element.tag.scorer';
import TextScorer from './text.scorer';
import ElementAttributeScorer from './element.attribute.scorer';
import ElementAttributeKeyScorer from './element.attribut.key.scorer';
import ElementAttributeValueScorer from './element.attribut.value.scorer';
import RelPositionScorer from './rel.position.scorer';
import CssClassScorer from './css.class.scorer';
"use strict";

export class ParamAnalyze {
    constructor(){
        this._types = [
            {"name":"html-tag", "giveclass": ElementTagScorer },
            {"name":"css-class", "giveclass": CssClassScorer },
            {"name":"target-relation", "giveclass": RelPositionScorer },
            {"name":"free-text", "giveclass": TextScorer },
            {"name":"html-attr-key-and-value", "giveclass": ElementAttributeScorer },
            {"name":"html-attr-key", "giveclass": ElementAttributeKeyScorer },
            {"name":"html-attr-value", "giveclass": ElementAttributeValueScorer }
        ];
    }

    analyzeScorerParam(nameScorer, param, elem, comparingElement = null, bodyRect = null){
        let ClassScorer = "";
        this._types.forEach(item =>{
            if(item.name === nameScorer){
                ClassScorer = item.giveclass;
            };
        }); 
        if(!ClassScorer){
            throw new Error("ParamAnalyze didn't find Scorer class for scorer: " + nameScorer);
        }
        return new ClassScorer().scorer(param, elem, comparingElement, bodyRect);
    }

    static stringMatchScores(datas, standard, allowPartialMatch) {
        var i;
        var score = 0;
        if(standard instanceof Array ) {
            standard.forEach(param =>  {
                for (i = 0; i < datas.length; i++) {
                    score = Math.max(score, ParamAnalyze.stringMatchScore(datas[i], param, allowPartialMatch));
                };
            });   
            return score;
        }
        for (i = 0; i < datas.length; i++) {
            score = Math.max(score, ParamAnalyze.stringMatchScore(datas[i], standard, allowPartialMatch));
        }
        return score;
    }

    static stringMatchScore(data, standard, allowPartialMatch) {
        var score = 0;
        if (!data) {
            return 0;
        }
        var dat = ParamAnalyze.pascalCase(data).toLowerCase();
        var str = ParamAnalyze.pascalCase(standard).toLowerCase();
        if (dat.indexOf(str) === -1) {
            return 0;
        }
        if (allowPartialMatch) {
            score = str.length / dat.length;
            if (score < 0.1) {
                score = 0;
            }
        } else if (str.length === dat.length) {
            score = 1;
        }
        return score;
    }

    static pascalCase(str) {
        if (!str) {
            return '';
        }
        return str.trim().replace(/_/g, '-').replace(/\-/g, ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
            return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/\s+/g, '').replace(/^[a-z]/, function(m){ return m.toUpperCase(); });
    }

}