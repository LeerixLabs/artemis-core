import {log} from '../common/logger';
import {Helper} from  '../common/common-helper';

export class Planner {

  constructor(settings) {
    this._settings = settings;
    this._plans = settings.plans;
  }

  _getPlanByTypeAndValue(type, value) {
    console.log(`Searching for relevant plan. type: ${type}, value: ${value}`);
    let plan = {};
    let planEntryInSettings = this._plans.find((p) => {
      return p.type === type && p.value === value;
    });
    if (planEntryInSettings) {
      log.debug(`found plan by type and value: ${Helper.toJSON(planEntryInSettings)}`);
    }
    if (!planEntryInSettings) {
      planEntryInSettings = this._plans.find((p) => {
        return p.type === type;
      });
      if (planEntryInSettings) {
        log.debug(`found plan by type only: ${Helper.toJSON(planEntryInSettings)}`);
      }
    }
    if (planEntryInSettings) {
      if (planEntryInSettings.plan.value) {
        log.debug(`plan already has a value: ${Helper.toJSON(planEntryInSettings.plan.value)}`);
        plan = planEntryInSettings.plan;
      } else {
        log.debug(`plan does not have a value. using: ${Helper.toJSON(value)}`);
        plan = JSON.parse(JSON.stringify(planEntryInSettings.plan));
        plan.value = value;
      }
    } else {
      log.error(`Unable to find relevant plan node. type: ${type}, value: ${value}`);
    }
    return plan;
  }

  _recursiveGetPlan(descNode) {
    let planNode = {};

    //node with 'and' items
    if (descNode.and) {
      planNode.and = [];
      descNode.and.forEach(n => {
        let p = this._recursiveGetPlan(n);
        planNode.and.push(p);
      });

      //node with object
    } else if (descNode.object) {
      planNode = this._getPlanByTypeAndValue(descNode.type, descNode.value);
      planNode.object = this._recursiveGetPlan(descNode.object);

    //leaf node
    } else {
      planNode = this._getPlanByTypeAndValue(descNode.type, descNode.value);
    }

    return planNode;
  }

  plan(modeledElmDesc) {
    log.debug('Planner.plan() - start');
    log.debug(`modeledElmDesc: ${Helper.toJSON(modeledElmDesc)}`);
    let scoringPlan = {};
    scoringPlan.object = this._recursiveGetPlan(modeledElmDesc.object);
    log.debug(`scoringPlan: ${Helper.toJSON(scoringPlan)}`);
    log.debug('Planner.plan() - end');
    return scoringPlan;
  }

}
