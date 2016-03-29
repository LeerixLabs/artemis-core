"use strict";
export class Modeler{
    constructor(){
        this.plans = document.setttingsJSON.plans;
    }

    /**
     * This method find plan in setttins and do json plans
     * @param json from Parser
     * @return json to Scorer with plans how to score elements from settings
     * TODO: include analize "rel-location"
     */
    model(inputJson){
        "use strict";
        let jsonRes = [];
        let jsonIncoming = JSON.parse(inputJson);
        for (let item of jsonIncoming) {
            let plan = this.__model_node(item);
            if(plan){
                jsonRes.push(plan);
            }
        }
        return JSON.stringify( {"and":jsonRes}, null, ' ');
    }
    
    __model_node(json){
        for (let plan of this.plans) {
            if (plan.type == json.type && plan.value == json.value) {
                return plan.plan;
            }
        }
        console.error("settings doesn't contain plan for this string:",json);
    }
}

