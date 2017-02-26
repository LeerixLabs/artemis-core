import {log} from '../common/logger';
import Helper from  '../common/common-helper';

export class Planner {

	constructor(settings) {
		this._settings = settings;
		this._plans = settings.plans;
		this._isDebug = log.isDebug();
	}

	_getPlanByTypeAndValue(type, value) {
		if (this._isDebug){log.debug(`Searching for relevant plan. type: ${type}, value: ${value}`)}
		let plan = {};
		let planEntryInSettings = this._plans.find((p) => {
			return p.type === type && p.value === value;
		});
		if (planEntryInSettings) {
			if (this._isDebug){log.debug(`found plan by type and value: ${Helper.toJSON(planEntryInSettings)}`)}
		}
		if (!planEntryInSettings) {
			planEntryInSettings = this._plans.find((p) => {
				return p.type === type;
			});
			if (planEntryInSettings) {
				if (this._isDebug){log.debug(`found plan by type only: ${Helper.toJSON(planEntryInSettings)}`)}
			}
		}
		if (planEntryInSettings) {
			plan = JSON.parse(JSON.stringify(planEntryInSettings.plan));
			if (!plan.and && !plan.or && !plan.value && plan.value !== 0) {
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
		if (this._isDebug){log.debug('Planner.plan() - start')}
		let scoringPlan = {};
		scoringPlan.object = this._recursiveGetPlan(modeledElmDesc.object);
		if (this._isDebug){log.debug(`scoringPlan: ${Helper.toJSON(scoringPlan)}`)}
		if (this._isDebug){log.debug('Planner.plan() - end')}
		return scoringPlan;
	}

}
