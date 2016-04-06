import ElementTagScorer from './scorers/html-tag-scorer.js';
import TextScorer from './scorers/text-scorer.js';
import ElementAttributeScorer from './scorers/html-attr-name-and-val-scorer.js';
import ElementAttributeKeyScorer from './scorers/html-attr-name-scorer.js';
import ElementAttributeValueScorer from './scorers/html-attr-val-scorer.js';
import RelPositionScorer from './scorers/rel-location-scorer.js';
import CssClassScorer from './scorers/css-class-scorer.js';
"use strict";

export class ParamAnalyzer {

    constructor() {
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

    analyzeScorerParam(nameScorer, param, elem, comparingElement = null, bodyRect = null) {
        let ClassScorer = "";
        this._types.forEach(item =>{
            if(item.name === nameScorer){
                ClassScorer = item.giveclass;
            }
        }); 
        if(!ClassScorer){
            throw new Error("ParamAnalyzer didn't find Scorer class for scorer: " + nameScorer);
        }
        return new ClassScorer().scorer(param, elem, comparingElement, bodyRect);
    }

}
