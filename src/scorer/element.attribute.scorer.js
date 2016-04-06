
export default class ElementAttributeScorer {

    scorer(param,elem){
        for(let i=0; i<elem.attrs.length; i++){
            if(elem.attrs[i]["name"] === param[0] &&  elem.attrs[i]["value"] === param[1]){
                return 1;
            } 
        }
        return 0;
    }
}
