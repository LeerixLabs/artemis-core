// TODO this functions dotn't attach to prodject

// import {numeric} from '../src/numeric-1.2.6.js'
"use strict";
class FeatureMap{


    constructor(){
        this.latest = 0;
        this.map = {};
        this.revmap = {};
    }

    addFeature(k){
        "use strict";
        this.map[k] =  this.latest;
        this.revmap[this.latest] = k;
        this.latest++;
    }

    toInt(k){
        "use strict";
        return this.map[k];
    }

    toKey(i){
        "use strict";
        return this.revmap[i];
    }
}


const IGNORED_TAGS = ['script', 'noscript'];
const ARETEMIS_SCORE_ATTR = "artemis-score";
const ARETEMIS_CLASS = "artemis-mark-";

class HtmlDOM {
    constructor(){
        this.console = console;
        this.window = window;
        this.document = document;
        this.head = this.document.head;
        this.body = this.document.body;

    }

    getAllDomElms() {
        return this.body.getElementsByTagName('*');
    }

    getRelevantDomElms(allDomElms) {
        var relevantDomElms = [];
        for (var i = 0; i < allDomElms.length; i++) {
            if (this.isRelevantElem(allDomElms[i])) {
                relevantDomElms.push(allDomElms[i]);
            }
        }
        return relevantDomElms;
    }

    isRelevantElem(domElm){
        return !IGNORED_TAGS.includes(domElm.tagName.toLowerCase()) && this.isDomElmVisible(domElm);
    }
    
    isDomElmVisible(domElm) {
        while (domElm.nodeName.toLowerCase() !== 'body' && this.window.getComputedStyle(domElm).display.toLowerCase() !== 'none' && this.window.getComputedStyle(domElm).visibility.toLowerCase() !== 'hidden') {
            domElm = domElm.parentNode;
        }
        return domElm.nodeName.toLowerCase() === 'body';
    }
}

class Element {

    constructor(id, domElm){
        this.domElm = domElm;
        this.idIntenal = id;
        this.tagName = this.domElm.tagName.toLowerCase();
        this.classes = this.domElm.classList;
        this.scoreAttr = '';
        this.attrs = this.domElm.attributes;
        this._weight = 0;

    }

    //use: elem.score
    get score() {
        if(this.domElm.hasAttribute(ARETEMIS_SCORE_ATTR)){
            return this.domElm.getAttribute(ARETEMIS_SCORE_ATTR);
        }
        return 0;
    }

    //use: elem.score = 0.2;
    set score(score) {
        this.domElm.setAttribute(ARETEMIS_SCORE_ATTR, score);
    }

    //use: elem.weight
    get weight() {
        return this._weight;
    }

    //use: elem.weight = 0.2;
    set weight(score) {
        this._weight = score;
    }

    //use: elem.artemisClass
    get artemisClass() {
        for(let classElem of this.classes){
            if(classElem.includes(ARETEMIS_CLASS)){
                return classElem;
            }
        }
        return '';
    }

    //use: elem.artemisClass = "red";
    set artemisClass(colorClass) {
        this.classes.add(`${ARETEMIS_CLASS}${colorClass}`);
    }

    removeArtemisClass(){
        for(let classElem of this.classes){
            if(classElem.includes(ARETEMIS_CLASS)){
                this.classes.remove(classElem);
            }
        }
    }

    removeAttributeScore(){
        this.domElm.removeAttribute(ARETEMIS_SCORE_ATTR);
        this.removeArtemisClass();
        //TODO delete under line, after artemis class add with style
        this.domElm.style.backgroundColor="#ffffff";
    }
}

export class Scorer{

    /**
     * given the model
     *  convert to low level feature
     *  convert feature to vector
     *  rank different element
     *  return top ranking elements
     * @param model
     */
    score(model){
        "use strict";
        let html = new HtmlDOM();
        let domElems = html.getRelevantDomElms(html.getAllDomElms());
        let i=0,arrElems = [];
        for(let domElem of domElems){
            let elem = new Element(i,domElem);
            elem.removeAttributeScore();
            //Parse JSON plan and analize
            elem.weight = this.analyze(elem, JSON.parse(model));
            arrElems.push(elem);
            i++;
        }

        //Get maximum Weight
        let arrWeights = arrElems.map(elm => elm.weight);
        let maxWeight = Math.max.apply( null, arrWeights );

        //Set endScore to element
        for (let i = 0; i < arrElems.length; i++) {
            arrElems[i].score = (arrElems[i].weight / maxWeight).toFixed(2);
        } 

        return arrElems;
    }

/*

max ( 1* [0], 1 * ( 1*[1]* 1*[1]))  * max ( 1* [0], 1 * ( 1*[1]* 1*[1])) 
class do regex with classes

*/
    analyze(elem,model){
        let keysModel = Object.keys(model);
        let condition = keysModel[0];
        let weight = model.weight;

        if(!(condition == "and" || condition == "or")) {
            return this.__isMatch(model, elem) * weight;
        }
        
        model = model[condition];
        if(model.length == 0){
            return 0;
        }
        
        if(condition == "and"){
            let partScore = 1;
            for (var i = 0; i < model.length; i++) {
                partScore *= this.analyze(elem,model[i]);
            }
            if(weight > 0){
                partScore *= weight;
            }
            return partScore;
        }
        if(condition == "or"){
            let partScore = [];
            for (var i = 0; i < model.length; i++) {
                let result = this.analyze(elem,model[i]);
                partScore.push(result);
            }
            return Math.max.apply(null, partScore);
        }
        throw new Error("Error Scrorer.analize in model contains: "+model);
    }

    __isMatch(model, elem){
        switch (model.scorer){
            case 'html-tag':
                return model.param == elem.tagName ? 1: 0;
            case 'css-class':
                return this.__stringMatchScores(elem.classes,model.param,true);
            case 'html-attr-key-and-value':
                for(let i=0; i<elem.attrs.length; i++){
                    if(elem.attrs[i]["name"] == model.param[0] &&  elem.attrs[i]["value"] == model.param[1]){
                        return 1;
                    } 
                }
                return 0;
            default :
                throw new Error("Unexpected Plan scorer: " + scorer);

        }
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


