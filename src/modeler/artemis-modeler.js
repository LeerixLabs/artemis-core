"use strict";
export class Modeler{
    constructor(){
        this.plans = document.setttingsJSON.plans;
    }

    model(inputJson){
        "use strict";
        //convert to low lever model
        let jsonRes = [];
        for (let item of inputJson) {
            jsonRes.push(this.__model_node(item));
        }
        return jsonRes;
    }
    
    __model_node(json){
        for (let plan of this.plans) {
            if (plan.type == json.type && plan.value == json.value) {
                return plan.plan;
            }
        }
    }
}

