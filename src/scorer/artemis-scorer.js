import {log} from '../common/logger';
import Helper from  '../common/common-helper';
import HtmlDOM from './../common/html-dom';
import Element from './../common/element';
import CssClassScorer from './scorers/css-class-scorer.js';
import CssStyleNameAndValScorer from './scorers/css-style-name-and-val-scorer.js';
import ElmColorScorer from './scorers/elm-color-scorer.js';
import ElmLocationScorer from './scorers/elm-location-scorer.js';
import ElmOrdinalScorer from './scorers/elm-ordinal-scorer.js';
import ElmSizeScorer from './scorers/elm-size-scorer.js';
import FreeTextScorer from './scorers/free-text-scorer.js';
import HtmlAttrNameAndValScorer from './scorers/html-attr-name-and-val-scorer.js';
import HtmlAttrNameScorer from './scorers/html-attr-name-scorer.js';
import HtmlAttrValScorer from './scorers/html-attr-val-scorer.js';
import HtmlTagScorer from './scorers/html-tag-scorer.js';
import RelPositionScorer from './scorers/rel-position-scorer.js';

export class Scorer{

	constructor(settings, htmlDom){
		this._settings = settings;
		this._isDebug = log.isDebug();
		this._pruneScore = settings && settings.scoring && settings.scoring.pruneScore || 0.01;
		this._htmlDom = htmlDom;
		this._scorersMap = new Map();
		this._registerScorers();
		this._ordinalValues = [];
		this._scoresCache = new Map();
		this._planNodeType = {
			LEAF: 'leaf',
			AND: 'and',
			OR: 'or',
			RELATION: 'relation',
			ORDINAL: 'ordinal',
			UNKNOWN: 'unknown'
		};
	}

	_registerScorers() {
		this._scorersMap.set('cssClass', new CssClassScorer('cssClass', this._getScorerSettings('cssClass')));
		this._scorersMap.set('cssStyleNameAndVal', new CssStyleNameAndValScorer('cssStyleNameAndVal', this._getScorerSettings('cssStyleNameAndVal')));
		this._scorersMap.set('elmColor', new ElmColorScorer('elmColor', this._getScorerSettings('elmColor')));
		this._scorersMap.set('elmLocation', new ElmLocationScorer('elmLocation', this._getScorerSettings('elmLocation')));
		this._scorersMap.set('elmSize', new ElmSizeScorer('elmSize', this._getScorerSettings('elmSize')));
		this._scorersMap.set('freeText', new FreeTextScorer('freeText', this._getScorerSettings('freeText')));
		this._scorersMap.set('htmlAttrNameAndVal', new HtmlAttrNameAndValScorer('htmlAttrNameAndVal', this._getScorerSettings('htmlAttrNameAndVal')));
		this._scorersMap.set('htmlAttrName', new HtmlAttrNameScorer('htmlAttrName', this._getScorerSettings('htmlAttrName')));
		this._scorersMap.set('htmlAttrVal', new HtmlAttrValScorer('htmlAttrVal', this._getScorerSettings('htmlAttrVal')));
		this._scorersMap.set('htmlTag', new HtmlTagScorer('htmlTag', this._getScorerSettings('htmlTag')));
		this._scorersMap.set('relPosition', new RelPositionScorer('relPosition', this._getScorerSettings('relPosition')));
		this._scorersMap.set('elmOrdinal', new ElmOrdinalScorer('elmOrdinal', this._getScorerSettings('elmOrdinal')));
		this._ordinalScorerName = 'elmOrdinal';
	}

	_getScorerSettings(scorerName) {
		return this._settings && this._settings.scorers && this._settings.scorers[scorerName] || {};
	}

	_getScorer(scorerName) {
		let scorer = this._scorersMap.get(scorerName);
		if (!scorer) {
			log.error(`Unable to find scorer by name: ${scorerName}`);
		}
		return scorer;
	}

	_getAllElements() {
		if (this._isDebug){log.debug('Scorer.getAllElements() - start')}
		let elms = [];
		let id = 0;
		let relevantDomElms = this._htmlDom.getRelevantDomElms();
		relevantDomElms.forEach( de => {
			let elm = new Element(id, de);
			elms.push(elm);
			id++;
		});
		if (this._isDebug){log.debug('Scorer.getAllElements() - end')}
		return elms;
	}

	_prepareOutput(startTime) {
		let scoringResult = {
			duration: (new Date().getTime() - startTime.getTime()) + 'ms',
			count: [0, 0, 0],
			perfects: [],
			elements: []
		};
		this._allElms.forEach( e => {
			scoringResult.count[0]++;
			if (e.primaryScore > 0) {
				scoringResult.elements.push(e.reportData());
				scoringResult.count[1]++;
				if (e.primaryScore === 1) {
					scoringResult.perfects.push(e.reportData());
					scoringResult.count[2]++;
				}
			}
		});
		return scoringResult;
	}

	_getPlanNodeType(planNode) {
		let planNodeType = this._planNodeType.UNKNOWN;
		if (planNode.and) {
			planNodeType = this._planNodeType.AND;
		} else if (planNode.or) {
			planNodeType = this._planNodeType.OR;
		} else if (planNode.object) {
			planNodeType = this._planNodeType.RELATION;
		} else if (planNode.scorer) {
			if (planNode.scorer === this._ordinalScorerName) {
				planNodeType = this._planNodeType.ORDINAL;
			} else {
				planNodeType = this._planNodeType.LEAF;
			}
		}
		return planNodeType;
	}

	_recursiveGetScore(planNode, elm, targetIndex){
		let planNodeType = this._getPlanNodeType(planNode);
		let logMsgPrefix = `${targetIndex} ${elm.tagName} ${elm.id}`;
		if (this._isDebug){log.debug(`${logMsgPrefix} planNodeType: ${planNodeType} - start`)}
		let score = 0;
		let weight = planNode.weight;
		if (!weight && weight !== 0) {
			weight = 1;
		}

		// Leaf node
		if (planNodeType === this._planNodeType.LEAF) {
			let cacheKey = `${elm.id}|${planNode.scorer}|${planNode.value.toString()}`;
			let cachedScore = this._scoresCache.get(cacheKey);
			if (cachedScore) {
				score = cachedScore;
			} else {
				let scorer = this._getScorer(planNode.scorer);
				if (scorer) {
					if (this._isDebug){log.debug(`${logMsgPrefix} ${scorer.name} ${planNode.value}`)}
					score = scorer.score(elm, planNode.value);
					this._scoresCache.set(cacheKey, score);
				}
			}
		}

		// Node with 'and' items
		else if (planNodeType === this._planNodeType.AND) {
			score = 1;
			planNode.and.forEach( n => {
				if (score !== 0) {
					score *= this._recursiveGetScore(n, elm, targetIndex);
				}
			});
		}

		// Node with 'or' items
		else if (planNodeType === this._planNodeType.OR) {
			score = 0;
			planNode.or.forEach( n => {
				score = Math.max(score, this._recursiveGetScore(n, elm, targetIndex));
			});
		}

		// Ordinal node
		else if (planNodeType === this._planNodeType.ORDINAL) {
			if (!this._ordinalValues[targetIndex]) {
				if (this._isDebug){log.debug(`${logMsgPrefix} Ordinal: ${planNode.value}`)}
				this._ordinalValues[targetIndex] = parseInt(planNode.value, 10);
			}
			score = 1;
		}

		// Node with object
		else if (planNodeType === this._planNodeType.RELATION) {
			if (this._isDebug){log.debug(`${logMsgPrefix} Relation handling - start`)}
			let secondaryTargetIndex = targetIndex + 1;
			score = 0;
			let scorer = this._getScorer(planNode.scorer);
			if (scorer) {
				this._scoreElements(this._allElms, planNode.object, secondaryTargetIndex);
				this._allElms.forEach(secondaryElm => {
					if (elm.id !== secondaryElm.id) {
						let relationScore = scorer.score(elm, secondaryElm, planNode.value);
						if (this._isDebug){log.debug(`${logMsgPrefix} ${scorer.name} relation score with ${secondaryElm.tagName} ${secondaryElm.id} is ${relationScore}`)}
						score = Math.max(score, secondaryElm.scores[secondaryTargetIndex] * relationScore);
					}
				});
			}
			if (this._isDebug){log.debug(`${logMsgPrefix} Relation handling - end`)}
		}

		// Unknown node
		else {
			log.error(`Unknown plan node type: ${Helper.toJSON(planNode)}`);
		}

		score *= weight;

		if (this._isDebug){log.debug(`${logMsgPrefix} planNodeType: ${planNodeType} - end. weight: ${weight}, score: ${score}`)}

		if (score < this._pruneScore) {
			if (this._isDebug){log.debug(`${logMsgPrefix} Node score is too low`)}
			score = 0;
		}

		return score;
	}

	_normalizeScores(elms, targetIndex) {
		if (this._isDebug){log.debug('Scorer.normalizeScores() - start')}
		if (this._isDebug){log.debug(`targetIndex: ${targetIndex}`)}
		let maxScore = Math.max.apply(null, elms.map( e => e.scores[targetIndex] ));
		if (this._isDebug){log.debug(`Max score for normalizing is ${maxScore}`)}
		elms.forEach( e => {
			if (e.getScore(targetIndex) > this._pruneScore) {
				e.setScore(targetIndex, maxScore ? Math.round(e.scores[targetIndex] / maxScore * 100) / 100 : 0);
			} else {
				e.setScore(targetIndex, 0);
			}
			if (this._isDebug){log.debug(`Normalized score for ${e.tagName} ${e.id} is ${e.scores[targetIndex]}`)}
		});
		if (this._isDebug){log.debug('Scorer.normalizeScores() - end')}
	}

	_handleOrdinal(elms, targetIndex) {
		if (this._isDebug){log.debug('Scorer.handleOrdinal() - start')}
		if (this._isDebug){log.debug(`targetIndex: ${targetIndex}`)}
		if (this._ordinalValues.length > targetIndex && this._ordinalValues[targetIndex] && this._ordinalValues[targetIndex] > 0) {
			let scorer = this._getScorer(this._ordinalScorerName);
			if (scorer) {
				let ordinalElm = scorer.getOrdinalElm(elms, targetIndex, this._ordinalValues[targetIndex]);
				if (ordinalElm) {
					elms.forEach(e => {
						e.scores[targetIndex] = (e.id === ordinalElm.id ? 1 : 0);
						if (this._isDebug) {
							log.debug(`Score for ${e.tagName} ${e.id} is ${e.scores[targetIndex]}`)
						}
					});
				} else {
					if (this._isDebug){log.debug(`Unable to find ordinal element. targetIndex: ${targetIndex}, ordinal: ${this._ordinalValues[targetIndex]}`)}
				}
			} else {
				log.error(`Unable to find scorer by name: ${this._ordinalScorerName}`);
			}
		}
		if (this._isDebug){log.debug('Scorer.handleOrdinal() - end')}
	}


	_scoreElements(elms, planNode, targetIndex) {
		if (this._isDebug){log.debug('Scorer.scoreElements() - start')}
		this._ordinalValues[targetIndex] = 0;
		elms.forEach( e => {
			if (this._isDebug){log.debug(`Scoring target ${targetIndex} - ${e.tagName} ${e.id} - start`)}
			e.setScore(targetIndex, this._recursiveGetScore(planNode, e, targetIndex));
			if (this._isDebug){log.debug(`Scoring target ${targetIndex} - ${e.tagName} ${e.id} - end`)}
		});
		this._normalizeScores(elms, targetIndex);
		this._handleOrdinal(elms, targetIndex);
		if (this._isDebug){log.debug('Scorer.scoreElements() - end')}
	}

	score(scoringPlan) {
		if (this._isDebug){log.debug('Scorer.score() - start')}
		let startTime = new Date();

		// Clean HTML DOM
		this._htmlDom.cleanDom();

		// Get all elements
		this._allElms = this._getAllElements();

		// Add element ids to HTML DOM
		this._allElms.forEach( e => {HtmlDOM.markElmIdOnHtmlDom(e.domElm, e.id);});
		this._htmlDom.artemisElmIdsExistOnHtmlDom = true;

		//reset
		this._ordinalValues = [];
		this._scoresCache = new Map();

		// Score
		this._scoreElements(this._allElms, scoringPlan.object, 0);

		// Add element scores to HTML DOM
		this._allElms.forEach( e => {HtmlDOM.markElmScoreOnHtmlDom(e.domElm, e.primaryScore);});
		this._htmlDom.artemisElmScoresExistOnHtmlDom = true;

		// Prepare output
		let scoringResult = this._prepareOutput(startTime);
		if (this._isDebug){log.debug(`scoringResult: ${Helper.toJSON(scoringResult)}`)}
		if (this._isDebug){log.debug('Scorer.score() - end')}
		return scoringResult;
	}

}
