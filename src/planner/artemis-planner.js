import {log} from '../common/logger';

export class Planner {

  constructor(settings) {
    this._settings = settings;
    this.plans = settings.plans;
  }

  findPlan(term){
     let plan = this.plans.find(pln => pln.type === "elm-type" && pln.value === term);
     return plan ? plan.plan : null;
  }

  static  isOneOfElements(wrd){
    return wrd.type === "elm-type";
  }

  itemPlans(json){
      return this.plans.find(x => x.type === json.type); 
  }

  plan(modeledQuery) {
    let jsonIncoming = modeledQuery;
    let currentplan = {
       "target": {
        "and": []
      }
    };

    function getLastInPlan() {
      return currentplan.target.and.length ?
        currentplan.target.and[currentplan.target.and.length-1] :
        null;
    }

    function isInsideRelation() {
      let last = getLastInPlan();
      return (last && last.scorer === 'rel-position');
    }

    let isRelation = function(word) {        
      return word.type === 'rel-position';
    };
    //replace all the '-' in the beginning 
    jsonIncoming.forEach(d=>{d.value = Array.isArray(d.value) ? d.value : d.value.replace(/^-/,'');});

    jsonIncoming.forEach( word => {
        let node = this.__model_node(word); 
        if(node){
            if (isInsideRelation()) {
                if(!getLastInPlan().target){
                    getLastInPlan().target = {
                        "and": []
                      };
                }
                getLastInPlan().target.and.push(node.plan);
            } else {
                currentplan.target.and.push(node.plan);
            }
        } else if (isRelation(word)) {
            let relationPlan = {
                "scorer": "rel-position",
                "param": word.value,
                "weight": 1,
                "target": null
            };
            currentplan.target.and.push(relationPlan);
        } else {
            let mynode = this.itemPlans(word);
            if(!mynode) throw new Error(`There is no such node: ${JSON.stringify(word,0,5)}`);
            
            node = JSON.parse(JSON.stringify(mynode)); // it must!!! - clone node
            node.plan.param = word.value;
            if (isInsideRelation()) {
                if(!getLastInPlan().target){
                    getLastInPlan().target = {
                        "and": []
                      };
                }
                getLastInPlan().target.and.push(node.plan);
            } else {
                currentplan.target.and.push(node.plan);
            }
        }
    });

    let scoringPlan = currentplan;
    log.debug('scoringPlan: ' + JSON.stringify(scoringPlan, null, 4));
    return scoringPlan;
  }

  __model_node(json) {
      return this.plans.find(x => x.type === json.type && x.value === json.value);
      console.error("settings doesn't contain plan for this string:",json);
  }
}
