import {REL_LOCATION_TYPE} from '../constants';
"use strict";

export class ParamAnalyze {
    constructor(){
        this._types = [
            {"name":ElementTagScorer.name, "giveclass": ElementTagScorer },
            {"name":ElementAttributeScorer.name, "giveclass": ElementAttributeScorer },
            {"name":CssClassScorer.name, "giveclass": CssClassScorer },
            {"name":RelPositionScorer.name, "giveclass": RelPositionScorer },
            {"name":TextScorer.name, "giveclass": TextScorer },
            {"name":ElementAttributeKeyScorer.name, "giveclass": ElementAttributeKeyScorer },
            {"name":ElementAttributeValueScorer.name, "giveclass": ElementAttributeValueScorer }
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

class ElementTagScorer {
   
    static get name() {
        return "html-tag";
    }

    scorer(param,elem){
        if (param === "element"){
            return 1;
        } else {
            return param === elem.tagName ? 1: 0;
        }
    }
}

class TextScorer {
    
    static get name() {
        return "free-text";
    }

    scorer(param,elem){
        return ParamAnalyze.stringMatchScores([elem.domElm.text, elem.domElm.value, elem.domElm.innerText, elem.domElm.textContent], param, true);
    }
}

class ElementAttributeScorer {

    static get name() {
        return "html-attr-key-and-value";
    }
    scorer(param,elem){
        for(let i=0; i<elem.attrs.length; i++){
            if(elem.attrs[i]["name"] === param[0] &&  elem.attrs[i]["value"] === param[1]){
                return 1;
            } 
        }
        return 0;
    }
}

class ElementAttributeKeyScorer {

    static get name() {
        return "html-attr-key";
    }
    scorer(param,elem){
        for(let i=0; i<elem.attrs.length; i++){
            if(elem.attrs[i]["name"] === param){
                return 1;
            } 
        }
        return 0;
    }
}

class ElementAttributeValueScorer {

    static get name() {
        return "html-attr-value";
    }
    scorer(param,elem){
        let  attrs = [];
        for (var i = 0; i < elem.attrs.length; i++) {
            attrs.push(elem.attrs[i].value);
        }
        return ParamAnalyze.stringMatchScores(attrs, param, true);;
    }
}

class RelPositionScorer {

    static get name() {
        return "target-relation";
    }

    scorer(param,elem, comparingElement, bodyRect){
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

class CssClassScorer {
   
    static get name() {
        return "css-class";
    }

    scorer(param,elem){ 
       return ParamAnalyze.stringMatchScores(elem.classes, param, true);
    }
}
