import {log} from '../common/logger';
import Helper from  '../common/common-helper';

export class Parser {

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
		this._preObjectTypePhrases = this._settings.phrases.filter( p => p.location === 'pre-object-type');
		this._objectTypePhrases = this._settings.phrases.filter( p => p.location === 'object-type');
		this._postObjectTypePhrases = this._settings.phrases.filter( p => p.location === 'post-object-type');
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
					sentenceInfo.value = rule.groupIndexValue === -1 ? '' : match[rule.groupIndexValue];
					sentenceInfo.target = rule.groupIndexTarget === -1 ? '' : match[rule.groupIndexTarget];
				}
			}
		}
		return sentenceInfo;
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
		let relevantPhrases = (state === 'pre-object-type')? this._objectTypePhrases.concat(this._preObjectTypePhrases) : this._postObjectTypePhrases;
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
						isObjectType: !!p['is-object-type'],
						isObjectRelation: !!p['is-object-relation'],
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
		let state = 'pre-object-type';
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
					state = 'object-type';
				}
				state = matchResult.isObjectType || state === 'post-object-type' ? 'post-object-type' : 'pre-object-type';
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

	parse(sentence) {
		if (this._isDebug){log.debug('Parser.parse() - start')}
		if (this._isDebug){log.debug(`sentence: ${sentence}`)}
		let sentenceInfo = this._parseSentence(sentence);
		let targetInfo = sentenceInfo.target ? this._buildElementDescriptionModel(sentenceInfo.target) : null;
		let parserOutput = {
			sentenceInfo: sentenceInfo,
			targetInfo: targetInfo
		};
		if (this._isDebug){log.debug(`Parser output: ${Helper.toJSON(parserOutput)}`)}
		if (this._isDebug){log.debug('Parser.parse() - end')}
		return parserOutput;
	}

}
