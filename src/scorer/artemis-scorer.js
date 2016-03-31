import {ParamAnalyze} from './artemis-paramanalyze.js'
"use strict";

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

    getRelevantElms(){
        var relevantElms = [];
        let allDomElms = this.getAllDomElms();

        for (var i = 0; i < allDomElms.length; i++) {
            if (this.isRelevantElem(allDomElms[i])) {
                let elem = new Element(i,allDomElms[i]);
                elem.removeAttributeScore();
                relevantElms.push(elem);
            }
        }
        return relevantElms;
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
        this._rect = this.setRect();

    }
    //return position rectangle element; use: elem.rect
    get rect() {
        return this._rect;
    }

    setRect() {
        let rectElm = this.domElm.getBoundingClientRect();
        rectElm.topPage = rectElm.top + window.scrollY;
        rectElm.bottomPage = rectElm.bottom + window.scrollY;
        rectElm.leftPage = rectElm.left + window.scrollX;
        rectElm.rightPage = rectElm.right + window.scrollX; 
        return rectElm;
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
        let elems = html.getRelevantElms();
        let i=0,arrElems = [];

        //Weigh each element
        for(let elem of elems){
            //Parse JSON plan and weigh element         
            elem.weight = this.recursiveScore( JSON.parse(model), elems, elem);
            arrElems.push(elem);
            i++;
        }

        //Get maximum Score
        let arrWeights = arrElems.map(elm => elm.weight);
        let maxWeight = Math.max.apply( null, arrWeights );

        //Set endScore to element
        for (let i = 0; i < arrElems.length; i++) {
            arrElems[i].score = (arrElems[i].weight / maxWeight).toFixed(2);
            // console.log( arrElems[i].tagName, arrElems[i].score, arrElems[i].rect );
        } 
        return arrElems;
    }

    recursiveScore(planNode, allElms, elem){
        let weight = planNode.weight;
        let score = 1;
        let paramAnalyze = new ParamAnalyze();

        //start node
        if(planNode.target && !planNode.scorer){
            score = score * this.recursiveScore(planNode.target, allElms, elem);
        }
        //end node
        else if(planNode.scorer && !planNode.target) {
            if(!weight && weight!==0){
                throw new Error("Not found weight in Node Plans: "+ planNode);
            }
            // score = this.__isMatch(planNode, elem) * weight;
            let relationScore = paramAnalyze.analyzeScorerParam(planNode.scorer, planNode.param, elem);
            score = weight * relationScore;
        }
        //node with node.and
        else if(planNode.and){
            for (var i = 0; i < planNode.and.length; i++) {
                score = score * this.recursiveScore(planNode.and[i], allElms, elem);
            // console.log( "and", score, weight, planNode.and);
            }
            if(weight > 0){
                score *= weight;
            }
        }
        //node with node.or
        else if (planNode.or){
            let partScore = [];
            for (var i = 0; i < planNode.or.length; i++) {
                let result = this.recursiveScore(planNode.or[i], allElms, elem);
                partScore.push(result);
            }
            score = Math.max.apply(null, partScore);
        }
        //next node with target
        else if(planNode.scorer && planNode.target){
            if(!weight && weight!==0){
                throw new Error("Not found weight in Node Plans: "+ planNode);
            }

            let maxScore = 0;
            // let param = ;
            for (i=0; i<allElms.length; i++) {
                let secondaryElm = allElms[i];
                if (elem !== secondaryElm) {
                    planNode.targetElem = secondaryElm;
                    // let relationScore = this.__isMatch(planNode, elem);
                    let relationScore = paramAnalyze.analyzeScorerParam(planNode.scorer, planNode.param, elem);
                    let planItemNode = planNode.target;
                    let secondaryScore = this.recursiveScore(planItemNode, allElms, secondaryElm);               
                    maxScore = Math.max(maxScore, weight * relationScore * secondaryScore);
                }
            }
            score = weight * maxScore;  
        }

        return score;
    }

}



