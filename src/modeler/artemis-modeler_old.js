export class Relation{
    constructor(kind, from, to){
        "use strict";
        this.kind = kind;
        this.from = from;
        this.to = to;
    }
}
export class Element{

    constructor(attributes){
        "use strict";
        this.attributes = attributes;
        this.edges = []
    }

    addEdge(kind, to){
        "use strict";
        this.edges.push(new Relation(kind, this, to));
    }


}
export class Modeler{
    //TODO : whe should handle the ordinal with relation to location rather than independent
    model(inputJson){
        "use strict";
        //convert to low lever model
        return this.__model_node(inputJson);
    }

    __model_node(json){
        "use strict";
        let attributes = [];
        let elem = new Element(attributes);
        for (var t of json){
            if (t.type !== 'rel-location'){
                elem.attributes.push(t);
            }else{
                let curr = this.__model_node(t.target);
                elem.addEdge(t.value, curr);
            }
        }
        return elem
    }



}

