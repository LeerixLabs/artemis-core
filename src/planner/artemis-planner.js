export class Planner {

  constructor(settings) {
    this._settings = settings;
    this.plans = settings.plans;
  }

  findPlan(term){
     let plan = this.plans.find(pln => pln.type === "elm-type" && pln.value === term);
     return plan ? plan.plan : null;
  }

  static isOneOfElements(term){
    return new RegExp("(element|button|link|input|checkbox|radio|label|image|panel|toolbar|tab|dropdown|item)").test(term);
  }

  plan(modeledQuery) {
    let jsonIncoming = modeledQuery;
    let plan = {
       "target": {
        "and": []
      }
    };

    let getLastInPlan = function() {
      return plan.target.and.length ?
        plan.target.and[plan.target.and.length-1] :
        null;
    };

    let isInsideRelation = function() {
      let last = getLastInPlan();
      return (last && last.scorer === 'target-relation');
    };

    let isRelation = function(word) {
      return new RegExp("(above|below|left of|right of|inside)").test(word.replace('-',' '));
    };

    jsonIncoming = jsonIncoming.map(d=>d.replace(/^-/,''));

    //jsonIncoming => ['button', 'left of', 'button', 'right of', 'button' ]
    jsonIncoming.forEach((word) => {
      let relationPlan = {
        "scorer": "target-relation",
        "param": word,
        "weight": 1,
        "target": null
      };
      let freeTextPlan =  {
        "scorer": "free-text",
        "param": "",
        "weight": 1
      };
      let currPlan;
      if (Planner.isOneOfElements(word)) {
        currPlan = this.findPlan(word);
        if (isInsideRelation()) {
          //relation type
           getLastInPlan().target = currPlan;
        } else {
           plan.target.and.push(currPlan);
        }
      } else if (isRelation(word)) {
        //new relation
        plan.target.and.push(relationPlan);
      } else {
        freeTextPlan.param = word;
        currPlan =  freeTextPlan;
        if (isInsideRelation()) {
          //relation type
          getLastInPlan().target = currPlan;
        } else {
           plan.target.and.push(currPlan);
        }
      }
    });

    return plan;
  }

  __model_node(json) {
      return this.plans.find(x => x.type === json.type && x.value === json.value);
      console.error("settings doesn't contain plan for this string:",json);
  }
}
