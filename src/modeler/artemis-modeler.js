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
       // console.log('INCOM: ',jsonIncoming)
        let plan = {
           "target": {
            "and": []
          }
        };
        
        let getLastInPlan = function(){
            if(!plan.target.and.length){
                return null;
            }
            return plan.target.and[plan.target.and.length-1];
        }
        let isInsideRelation  = function(){
          let last = getLastInPlan();
          
          if(last && last.scorer === 'target-relation'){
              return  true;
          }

        };
        let isRelation = function(word){
              
          return new RegExp("(above|below|left of|right of|inside)").test(word.replace('-',' '));
        }
        jsonIncoming = jsonIncoming.map((word)=>{
           return word.replace(/-/,'');
        });
    //     console.log('INCOM: ',jsonIncoming)
        //jsonIncoming => ['button', 'left of', 'button', 'right of', 'button' ]
        jsonIncoming.forEach((word)=>{
            let buttonPlan  = this.plans[0].plan; 
            
            let relationType = word;
            let relationPlan = {
                    "scorer": "target-relation",
                    "param": relationType,
                    "weight": 1,
                    "target": null
            };           
            if(word=='button'){
                
                if(isInsideRelation()){//relation type
                   getLastInPlan().target = buttonPlan;
                }else{
                   plan.target.and.push(buttonPlan); 
                }
            }else if(isRelation(word)){//new relation 
                plan.target.and.push(relationPlan);
            }
        }) 
       //console.log('PLAN: ',plan)
        
        return JSON.stringify(plan, null, ' ');
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

