export class Planner {

  constructor(settings) {
    this._settings = settings;
    this.plans = settings.plans;
  }

  findPlan(term){
     let plan = this.plans.find(pln => pln.type === "elm-type" && pln.value === term);
     return plan ? plan.plan : null;
  }

  static  isOneOfElements(term, _settings){
    return new RegExp(_settings.phrases.find(p => p.location === "target-type").phrase).test(term);
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
      return (last && last.scorer === 'rel-position');
    };

    let isRelation = function(word, settings) {        
      return new RegExp(settings.phrases.find(p => p.type === "rel-position").phrase).test(word.replace('-',' '));
    };

    jsonIncoming = jsonIncoming.map(d=>d.replace(/^-/,''));

    //jsonIncoming => ['button', 'left of', 'button', 'right of', 'button' ]
    jsonIncoming.forEach( word => {
      let relationPlan = {
        "scorer": "rel-position",
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
      if (Planner.isOneOfElements(word, this._settings)) {
        currPlan = this.findPlan(word);
        if (isInsideRelation()) {
          //relation type
           getLastInPlan().target = currPlan;
        } else {
           plan.target.and.push(currPlan);
        }
      } else if (isRelation(word, this._settings)) {
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
