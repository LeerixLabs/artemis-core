
export default class ElementTagScorer {
 
    scorer(param,elem){
        if (param === "element"){
            return 1;
        } else {
            return param === elem.tagName ? 1: 0;
        }
    }
}