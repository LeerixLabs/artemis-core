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
        // console.log("score model",model);
        let html = new HtmlDOM();
        let domElems = html.getRelevantDomElms(html.getAllDomElms());
        let i=0,arrElems = [];

        for(let domElem of domElems){
            let elem = new Element(i,domElem);
            elem.removeAttributeScore();
            //Parse JSON and analize
            elem.weight = this.analyze(elem, JSON.parse(model));
            console.log("ELEM weight: ",elem.tagName,elem.weight);
            arrElems.push(elem);
            i++;
        }
        return arrElems;

    }

    analyze(elem,model){
        let keysModel = Object.keys(model);
        let condition = keysModel[0];
        let weight = model.weight;

        if(!(condition == "and" || condition == "or")) {
            return this.__isMatch(model, elem) * weight;
        }
        model = model[condition];
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


/*

max ( 1* [0], 1 * ( 1*[1]* 1*[1])) 
* max ( 1* [0], 1 * ( 1*[1]* 1*[1])) 
class do regex with classes

*/
    }

    __isMatch(model, elem){
        switch (model.scorer){
            case 'html-tag':
                return model.param == elem.tagName ? 1: 0;
            case 'css-class':
                //TODO include RegExp for find like this "mybtn" or "myButtonFirst". need return  0...1
                for(let cssClass of model.param){
                    for(let i=0; i<elem.classes.length; i++){
                        if(cssClass == elem.classes[i]){
                            return 1;
                        }
                    }
                }
                return 0;
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




    __analyzeOLD(elem,model){
        
      /*  let pointJson = {
                        "and": [
                            {
                                "scorer": "html-tag",
                                "param": "input",
                                "weight": 0.8
                            },
                            {
                                "scorer": "html-attr-key-and-value",
                                "param": ["type", "button"],
                                "weight": 1
                            }
                        ],
                        "weight": 1
                    };

        let condition = Object.keys(pointJson)[0];
        let resWeight = 1;
        console.log(" !");
        if(condition=="and"){
            for(let simpleJson of pointJson[condition]){
                let elemType = this.__isMatch(simpleJson, elem);
                console.log("elemType!",elemType);
                resWeight *=elemType;
            }
            
        }
console.log("resWeight!",resWeight);
        */
        function factorial(n, acc = 1) {
           
            if (n <= 1) return acc;
            return factorial(n - 1, n * acc);
        }
        let rec = factorial(100);
        console.log( rec );
        console.log("resWeight!",resWeight);

/*

max ( 1* [0], 1 * ( 1*[1]* 1*[1])) 
* max ( 1* [0], 1 * ( 1*[1]* 1*[1])) 
class do regex with classes

*/


        // console.log("condition",  condition   );
        let testjson ={
                                "scorer": "css-class",
                                "param": ["button", "btn"],
                                "weight": 1
                            };
        
// console.log("pointJson", pointJson[condition]   );
// console.log("testjson",   Object.keys(testjson)    );

// console.log( true condition false ); 

        




            // if(elemType){
            //    
            // }
        // if( elemType instanceof Object ){
        //     for(let i=0; i<elemType.length; i++){
        //         if(elemType[i]["name"] == ){

        //         }
        //         console.log("itemType",  elemType[i]["name"]   );
        //     }

        //     console.log("elemType",  elemType   );
        //     console.log("testjson",  testjson.param   );
        // }
//typeof this.__getScorerElem(testjson.scorer, elem)) == Object
        // for(let itemModel of model){
        //     let condition = Object.keys(itemModel)[0];
        //     //itemModel[condition]
        //     //if Obj doesn't have group Obj
        //     if (Object.keys( itemModel[condition])[0] == 0) {

        //     }
        //     console.log("itemModel",itemModel[condition]);
        //     console.log("analyze", Object.keys( itemModel[condition])[0] == 0);
        // }

        console.log("analyze");
        if(model=="input" && elem.tagName == model && elem.domElm.getAttribute("type") == "text"){
            // return 1;
        }  
        if(model=="button" && elem.tagName == model && elem.domElm.getAttribute("type") == "submit"){
            // return 1;
        } 
    }

}


