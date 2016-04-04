"use strict";
export class Modeler{
    constructor(){
        this.plans = document.setttingsJSON.plans;
        this.elemRegex = document.setttingsJSON.phrases.find(x => x.location === "target-type").phrase;
    }

    /**
     * This method find plan in setttins and do json plans
     * @param json from Parser
     * @return json to Scorer with plans how to score elements from settings
     * TODO: include analize "rel-location"
     */
    findPlan(term){
       let plan =   this.plans.find(pln => pln.type === "elm-type" && pln.value === term);   
       return plan ? plan.plan : null;    
    }
    isOneOfElements(term){
      return new RegExp("(element|button|link|input|checkbox|radio|label|image|panel|toolbar|tab|dropdown|item)").test(term);
    }
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
        
        jsonIncoming = jsonIncoming.map(d=>d.replace(/^-/,''));
        
    //     console.log('INCOM: ',jsonIncoming)
        //jsonIncoming => ['button', 'left of', 'button', 'right of', 'button' ]
        jsonIncoming.forEach((word)=>{
            
            
            let relationType = word;
            let relationPlan = {
                    "scorer": "target-relation",
                    "param": relationType,
                    "weight": 1,
                    "target": null
            }; 
            let freeTextPlan =  {
                "scorer": "free-text",
                "param": "",
                "weight": 1
            };   
            let currPlan;       
            if(this.isOneOfElements(word)){
                currPlan = this.findPlan(word);   
                if(isInsideRelation()){//relation type
                   getLastInPlan().target = currPlan;
                }else{
                   plan.target.and.push(currPlan); 
                }
            }else if(isRelation(word)){//new relation 
                plan.target.and.push(relationPlan);
            }else{
                freeTextPlan.param = word;
                plan.target.and.push(freeTextPlan)
            }
        }) 

        return JSON.stringify(plan, null, ' ');
    }
    
    __model_node(json) {
        return this.plans.find(x => x.type === json.type && x.value === json.value);
        console.error("settings doesn't contain plan for this string:",json);
    }
}

