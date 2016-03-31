export class ParamAnalyze {
    constructor(){
        this._types = [
            {"name":ElementTagScorer.name, "giveclass": ElementTagScorer },
            {"name":ElementAttributeScorer.name, "giveclass": ElementAttributeScorer },
            {"name":CssClassScorer.name, "giveclass": CssClassScorer },
            {"name":RelPositionScorer.name, "giveclass": RelPositionScorer }
        ];
    }

    analyzeScorerParam(nameScorer, param, elem){
        let ClassScorer = ""; 
        this._types.forEach(item =>{
            if(item.name === nameScorer){
                ClassScorer = item.giveclass;
            };
        }); 
        if(!ClassScorer){
            throw new Error("ParamAnalyze didn't find Scorer class for scorer: " + nameScorer);
        }
        return new ClassScorer().scorer(param, elem);
    }
}

class ElementTagScorer {
   
    static get name() {
        return "html-tag";
    }

    scorer(param,elem){
       return param == elem.tagName ? 1: 0;
    }
}

class ElementAttributeScorer {

    static get name() {
        return "html-attr-key-and-value";
    }
    scorer(param,elem){
        for(let i=0; i<elem.attrs.length; i++){
            if(elem.attrs[i]["name"] == param[0] &&  elem.attrs[i]["value"] == param[1]){
                return 1;
            } 
        }
        return 0;
    }
}

class RelPositionScorer {

    static get name() {
        return "target-relation";
    }

    scorer(param,elem){
        return 1;
    }
}

class CssClassScorer {
   
    static get name() {
        return "css-class";
    }

    scorer(param,elem){
       return this.__stringMatchScores(elem.classes, param, true);
    }

    __stringMatchScores(datas, standard, allowPartialMatch) {
        var i;
        var score = 0;
        if(standard instanceof Array ) {
            standard.forEach(param =>  {
                for (i = 0; i < datas.length; i++) {
                    score = Math.max(score, this.__stringMatchScore(datas[i], param, allowPartialMatch));
                };
            });   
            return score;
        }
        for (i = 0; i < datas.length; i++) {
            score = Math.max(score, this.__stringMatchScore(datas[i], standard, allowPartialMatch));
        }
        return score;
    }

    __stringMatchScore(data, standard, allowPartialMatch) {
        var score = 0;
        if (!data) {
            return 0;
        }
        var dat = this.__pascalCase(data).toLowerCase();
        var str = this.__pascalCase(standard).toLowerCase();
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

    __pascalCase(str) {
        if (!str) {
            return '';
        }
        return str.trim().replace(/_/g, '-').replace(/\-/g, ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
            return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/\s+/g, '').replace(/^[a-z]/, function(m){ return m.toUpperCase(); });
    }
}
