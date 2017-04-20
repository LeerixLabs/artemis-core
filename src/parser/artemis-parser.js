import {log} from '../common/logger';
import Helper from  '../common/common-helper';

export default class Parser {

	constructor(settings) {
		this._settings = settings;
		this._isDebug = log.isDebug();
		this._actionPhrases = this._settings.actionPhrases;
		this._preObjectTypePhrases = this._settings.targetPhrases.filter( p => p.location === 'preObjectType');
		this._objectTypePhrases = this._settings.targetPhrases.filter( p => p.location === 'objectType');
		this._postObjectTypePhrases = this._settings.targetPhrases.filter( p => p.location === 'postObjectType');
	}

	_parseAction(sentence) {
		let found = false;
		let actionInfo = {
			action: '',
			value: '',
			target: ''
		};
		for (let rule of this._actionPhrases) {
			if (!found) {
				let match = (new RegExp(rule.phrase, 'i')).exec(sentence);
				if (match) {
					let numOfGroups = 0;
					if (rule.groupIndexValue) {
						numOfGroups++;
					}
					if (rule.groupIndexTarget) {
						numOfGroups++;
					}
					if (numOfGroups === 0 || match.length === numOfGroups + 1) {
						found = true;
						actionInfo.action = rule.action;
						actionInfo.value = rule.groupIndexValue && rule.groupIndexValue >= 1 ? match[rule.groupIndexValue] : '';
						actionInfo.target = rule.groupIndexTarget && rule.groupIndexTarget >= 1 ? match[rule.groupIndexTarget] : '';
					}
				}
			}
		}
		return actionInfo;
	}

	static _trimSentence(sentence, shouldRemoveTheWordThe) {
		let newSentence = sentence.trim();
		if (shouldRemoveTheWordThe && newSentence.toLowerCase().indexOf('the ') === 0) {
			newSentence = newSentence.substring(4);
			newSentence = newSentence.trim();
		}
		if (newSentence !== sentence) {
			if (this._isDebug){log.debug(`Sentence trimmed`)}
			if (this._isDebug){log.debug(`Old sentence: ${sentence}`)}
			if (this._isDebug){log.debug(`New sentence: ${newSentence}`)}
		}
		return newSentence;
	}

	_getMatch(sentence, state) {
		if (this._isDebug){log.debug(`Get next match in text: ${sentence}`)}
		if (this._isDebug){log.debug(`state: ${state}`)}
		let matchResult = null;
		let relevantPhrases = (state === 'preObjectType')? this._objectTypePhrases.concat(this._preObjectTypePhrases) : this._postObjectTypePhrases;
		relevantPhrases.forEach( p => {
			if (!matchResult) {
				let matches = new RegExp(`^${p.phrase}`, `i`).exec(sentence);
				if (matches
				&& matches.length > 0
				&& matches[0]
				&& (sentence.length === matches[0].length
				||  sentence.length > matches[0].length
				&& sentence.charAt(matches[0].length) === ' ')) {
					if (this._isDebug){log.debug(`Match found for: ${matches[0]}`)}
					let matchedStrLength = matches[0].length;
					if (matches.length > 1) {
						matches.shift();
					}
					matchResult = {
						type: p.type,
						value: p.value !== undefined ? p.value : matches.length === 1 ? matches[0] : matches,
						isObjectType: !!p.isObjectType,
						isObjectRelation: !!p.isObjectRelation,
						matchedStrLength: matchedStrLength
					};
					if (this._isDebug){log.debug(`matchResult: ${Helper.toJSON(matchResult)}`)}
				}
			}
		});
		if (!matchResult) {
			log.error(`No match found for sentence: ${sentence}`);
		}
		return matchResult;
	}

	static _recursiveRemoveExtraAndNodes(node) {
		if (node.object.object) {
			Parser._recursiveRemoveExtraAndNodes(node.object);
		}
		if (node.object.and) {
			node.object.and.forEach( n => {
				if (n.object) {
					Parser._recursiveRemoveExtraAndNodes(n);
				}
			});
		}
		if (node.object.and && node.object.and.length === 1) {
			node.object = node.object.and[0];
			delete node.object.and;
		}
	}

	_buildElementDescriptionModel(elmDescStr) {
		let modeledElmDesc = {
			object: {}
		};
		let objectNode = modeledElmDesc.object;
		let state = 'preObjectType';
		let shouldRemoveTheWordTheIfExists = true;
		let sentence = Parser._trimSentence(elmDescStr, shouldRemoveTheWordTheIfExists);

		while (sentence.length > 0) {
			let matchResult = this._getMatch(sentence, state);
			if (matchResult) {
				if (matchResult.isObjectRelation) {
					objectNode = modeledElmDesc.object;
				}
				if (!objectNode.and) {
					objectNode.and = [];
				}
				objectNode.and.push({});
				let propertyNode = objectNode.and[objectNode.and.length - 1];
				propertyNode.type = matchResult.type;
				propertyNode.value = matchResult.value;
				if (matchResult.isObjectRelation) {
					propertyNode.object = {};
					objectNode = propertyNode.object;
					state = 'objectType';
				}
				state = matchResult.isObjectType || state === 'postObjectType' ? 'postObjectType' : 'preObjectType';
				sentence = sentence.substring(matchResult.matchedStrLength);
				shouldRemoveTheWordTheIfExists = matchResult.isObjectRelation;
				sentence = Parser._trimSentence(sentence, shouldRemoveTheWordTheIfExists);
			} else {
				sentence = '';
			}
		}

		Parser._recursiveRemoveExtraAndNodes(modeledElmDesc);
		return modeledElmDesc;
	};

	parseDescription(description) {
		if (this._isDebug){log.debug('Parser.parseDescription() - start')}
		if (this._isDebug){log.debug(`description: ${description}`)}
		let targetInfo = this._buildElementDescriptionModel(description);
		if (this._isDebug){log.debug(`targetInfo: ${Helper.toJSON(targetInfo)}`)}
		if (this._isDebug){log.debug('Parser.parseDescription() - end')}
		return targetInfo;
	}

	parse(sentence) {
		if (this._isDebug){log.debug('Parser.parse() - start')}
		if (this._isDebug){log.debug(`sentence: ${sentence}`)}
		let actionInfo = this._parseAction(sentence);
		let targetInfo = actionInfo.target ? this.parseDescription(actionInfo.target) : null;
		let parserOutput = {
			actionInfo: actionInfo,
			targetInfo: targetInfo
		};
		if (this._isDebug){log.debug(`Parser output: ${Helper.toJSON(parserOutput)}`)}
		if (this._isDebug){log.debug('Parser.parse() - end')}
		return parserOutput;
	}

}
