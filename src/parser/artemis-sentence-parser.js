import {log} from '../common/logger';

export class SentenceParser {

	constructor(settings) {
		this._settings = settings;
		this._isDebug = log.isDebug();
		this._actionType = {
			LOCATE: 'locate',
			CLICK: 'click',
			WRITE: 'write'
		};
		this._parsingRules = [
			{
				regStr: '^(?:find )([\\S\\s]+)$',
				action: this._actionType.LOCATE,
				numOfGroups: 1,
				groupIndexTarget: 1,
				groupIndexValue: -1
			},
			{
				regStr: '^(?:locate )([\\S\\s]+)$',
				action: this._actionType.LOCATE,
				numOfGroups: 1,
				groupIndexTarget: 1,
				groupIndexValue: -1
			},
			{
				regStr: '^(?:click )([\\S\\s]+)$',
				action: this._actionType.CLICK,
				numOfGroups: 1,
				groupIndexTarget: 1,
				groupIndexValue: -1
			},
			{
				regStr: '^(?:push )([\\S\\s]+)$',
				action: this._actionType.CLICK,
				numOfGroups: 1,
				groupIndexTarget: 1,
				groupIndexValue: -1
			},
			{
				regStr: '^(?:press )([\\S\\s]+)$',
				action: this._actionType.CLICK,
				numOfGroups: 1,
				groupIndexTarget: 1,
				groupIndexValue: -1
			},
			{
				regStr: '^(?:enter )(?:")([\\S\\s]+)(?:")(?: in )([\\S\\s]+)$',
				action: this._actionType.WRITE,
				numOfGroups: 2,
				groupIndexValue: 1,
				groupIndexTarget: 2
			},
			{
				regStr: '^(?:enter )(?:\')([\\S\\s]+)(?:\')(?: in )([\\S\\s]+)$',
				action: this._actionType.WRITE,
				numOfGroups: 2,
				groupIndexValue: 1,
				groupIndexTarget: 2
			},
			{
				regStr: '^(?:enter )([\\S\\s]+)(?: in )([\\S\\s]+)$',
				action: this._actionType.WRITE,
				numOfGroups: 2,
				groupIndexValue: 1,
				groupIndexTarget: 2
			}
		];
		this._actionType = {
			LOCATE: 'locate',
			CLICK: 'click',
			WRITE: 'write'
		};
	}

	_parseSentence(sentence) {
		let found = false;
		let sentenceInfo = {
			action: '',
			value: '',
			target: ''
		};
		for (let rule of this._parsingRules) {
			if (!found) {
				let match = (new RegExp(rule.regStr, 'i')).exec(sentence);
				if (match && match.length === rule.numOfGroups + 1) {
					found = true;
					sentenceInfo.action = rule.action;
					sentenceInfo.target = rule.groupIndexTarget === -1 ? '' : match[rule.groupIndexTarget];
					sentenceInfo.value = rule.groupIndexValue === -1 ? '' : match[rule.groupIndexValue];
				}
			}
		}
		return sentenceInfo;
	}

	parse(sentence) {
		return this._parseSentence(sentence)
	}

}
