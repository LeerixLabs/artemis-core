import {ParamAnalyze} from './artemis-paramanalyze.js'
import {IGNORED_TAGS} from '../constants';
import {ARETEMIS_SCORE_ATTR} from '../constants';
import {ARETEMIS_CLASS} from '../constants';
"use strict";

class HtmlDOM {
    constructor(){
        this.console = console;
        this.window = window;
        this.document = document;
        this.head = this.document.head;
        this.body = this.document.body;
        this.bodyRect = this.setRect();
    }

    setRect() {
        let rectElm = this.body.getBoundingClientRect();
        rectElm.topPage = rectElm.top + window.scrollY;
        rectElm.bottomPage = rectElm.bottom + window.scrollY;
        rectElm.leftPage = rectElm.left + window.scrollX;
        rectElm.rightPage = rectElm.right + window.scrollX; 
        return rectElm;
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
        this.unicue = false;

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
    get colorClass() {
        for(let classElem of this.classes){
            if(classElem.includes(ARETEMIS_CLASS)){
                return classElem;
            }
        }
        return '';
    }

    //use: elem.artemisClass = "red";
    set colorClass(colorClass) {
        this.classes.add(`${ARETEMIS_CLASS}${colorClass}`);
    }

    removeColorClass(){
        for(let classElem of this.classes){
            if(classElem.includes(ARETEMIS_CLASS)){
                this.classes.remove(classElem);
            }
        }
    }

    removeAttributeScore(){
        this.domElm.removeAttribute(ARETEMIS_SCORE_ATTR);
        this.removeColorClass();
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
    constructor(){
        this.html = new HtmlDOM();
        this.allElms = this.html.getRelevantElms();
    }

    score(model){
        "use strict";
        let i=0,arrElems = [];

        //Weigh each element
        for(let elem of this.allElms){
            //Parse JSON plan and weigh element         
            elem.weight = this.recursiveScore( JSON.parse(model), elem);
            arrElems.push(elem);
            i++;
        }

        //Get maximum Score
        let arrWeights = arrElems.map(elm => elm.weight);
        let maxWeight = Math.max.apply( null, arrWeights );

        //Set endScore to element
        for (let i = 0; i < arrElems.length; i++) {
            let d =(arrElems[i].weight / maxWeight).toFixed(2);
            arrElems[i].score = maxWeight ? ((arrElems[i].weight / maxWeight).toFixed(2)) : 0;
        } 
        //Set unice param to element
        this.isUnicueElement(arrElems);
        return arrElems;
    }

    isUnicueElement(arrElems){
        let isUnicue = arrElems.filter(elem => {
            return +elem.score === 1;
        });
        isUnicue[0].unicue = isUnicue.length===1;
    }

    recursiveScore(planNode, elem){
        let weight = planNode.weight;
        let score = null;
        let paramAnalyze = new ParamAnalyze();
        
        //start node
        if(planNode.target && !planNode.scorer){
            score = (score !== null) ? score * this.recursiveScore(planNode.target, elem)
                : this.recursiveScore(planNode.target, elem);
        }
        //end node
        else if(planNode.scorer && !planNode.target) {
            if(!weight && weight!==0){
                throw new Error("Not found weight in Node Plans: "+ planNode);
            }
            let relationScore = paramAnalyze.analyzeScorerParam(planNode.scorer, planNode.param, elem);
            score = weight * relationScore;
        }
        //node with node.and
        else if(planNode.and){
            for (var i = 0; i < planNode.and.length; i++) {
                score = (score !== null) ? score * this.recursiveScore(planNode.and[i], elem)
                : this.recursiveScore(planNode.and[i], elem);
            }
            if(weight > 0){
                score *= weight;
            }
        }
        //node with node.or
        else if (planNode.or){
            let partScore = [];
            for (var i = 0; i < planNode.or.length; i++) {
                let result = this.recursiveScore(planNode.or[i], elem);
                partScore.push(result);
            }
            score = Math.max.apply(null, partScore);
        }
        //next node with target
        else if(planNode.scorer && planNode.target){
            if(!weight && weight!==0){
                throw new Error("Not found weight in Node Plans: " + planNode);
            }

            let maxScore = 0;
            for (i=0; i<this.allElms.length; i++) {
                let secondaryElm = this.allElms[i];
                if (elem !== secondaryElm) {
                    planNode.targetElem = secondaryElm;
                    let relationScore = paramAnalyze.analyzeScorerParam(planNode.scorer, planNode.param, elem, secondaryElm, this.html.bodyRect);
                    let planItemNode = planNode.target;
                    let secondaryScore = this.recursiveScore(planItemNode, secondaryElm);               
                    maxScore = Math.max(maxScore, weight * relationScore * secondaryScore);
                }
            }
            score = weight * maxScore;  
        }
        return score;
    }

}



