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
		alert(this._isDebug);
		this._pruneScore = (settings && settings.scoring && settings.scoring['prune-score']) || 0;
		this._htmlDom = htmlDom;
		this._scorersMap = new Map();
		this._registerScorers();
		this._planNodeType = {
			AND: 'and',
			OR: 'or',
			RELATION: 'relation',
			LEAF: 'leaf',
			UNKNOWN: 'unknown'
		}
	}

	_registerScorers() {
		this._scorersMap.set('css-class', new CssClassScorer('css-class', this._getScorerSettings('css-class')));
		this._scorersMap.set('css-style-name-and-val', new CssStyleNameAndValScorer('css-style-name-and-val', this._getScorerSettings('css-style-name-and-val')));
		this._scorersMap.set('elm-color', new ElmColorScorer('elm-color', this._getScorerSettings('elm-color')));
		this._scorersMap.set('elm-location', new ElmLocationScorer('elm-location', this._getScorerSettings('elm-location')));
		this._scorersMap.set('elm-ordinal', new ElmOrdinalScorer('elm-ordinal', this._getScorerSettings('elm-ordinal')));
		this._scorersMap.set('elm-size', new ElmSizeScorer('elm-size', this._getScorerSettings('elm-size')));
		this._scorersMap.set('free-text', new FreeTextScorer('free-text', this._getScorerSettings('free-text')));
		this._scorersMap.set('html-attr-name-and-val', new HtmlAttrNameAndValScorer('html-attr-name-and-val', this._getScorerSettings('html-attr-name-and-val')));
		this._scorersMap.set('html-attr-name', new HtmlAttrNameScorer('html-attr-name', this._getScorerSettings('html-attr-name')));
		this._scorersMap.set('html-attr-val', new HtmlAttrValScorer('html-attr-val', this._getScorerSettings('html-attr-val')));
		this._scorersMap.set('html-tag', new HtmlTagScorer('html-tag', this._getScorerSettings('html-tag')));
		this._scorersMap.set('rel-position', new RelPositionScorer('rel-position', this._getScorerSettings('rel-position')));
	}

	_getScorerSettings(scorerName) {
		return this._settings && this._settings.scorers && this._settings.scorers[scorerName] || {};
	}

	_getScorer(scorerName) {
		let scorer = this._scorersMap.get(scorerName);
		if (scorer) {
			return scorer;
		} else {
			log.error(`Unable to find scorer by name: ${scorerName}`);
		}
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
			planNodeType = this._planNodeType.LEAF;
		}
		return planNodeType;
	}

	_recursiveGetScore(planNode, elm){
		let planNodeType = this._getPlanNodeType(planNode);
		let logMsgPrefix = `${elm.tagName} ${elm.id}`;
		if (this._isDebug){log.debug(`${logMsgPrefix} planNodeType: ${planNodeType} - start`)}
		let score = 0;
		let weight = planNode.weight;
		if (!weight && weight !== 0) {
			weight = 1;
		}

		// Node with 'and' items
		if (planNodeType === this._planNodeType.AND) {
			score = 1;
			planNode.and.forEach( n => {
				if (score !== 0) {
					score *= this._recursiveGetScore(n, elm);
				}
			});
		}

		// Node with 'or' items
		else if (planNodeType === this._planNodeType.OR) {
			score = 0;
			planNode.or.forEach( n => {
				score = Math.max(score, this._recursiveGetScore(n, elm));
			});
		}

		// Node with object
		else if (planNodeType === this._planNodeType.RELATION) {
			score = 0;
			this._allElms.forEach( secondaryElm => {
				if (elm.id !== secondaryElm.id) {
					let scorer = this._getScorer(planNode.scorer);
					if (scorer) {
						let relationScore = scorer.score(elm, secondaryElm, planNode.value);
						if (this._isDebug){log.debug(`${logMsgPrefix} ${scorer.name} relation score with ${secondaryElm.tagName} ${secondaryElm.id} is ${relationScore}`)}
						let secondaryScore = this._recursiveGetScore(planNode.object, secondaryElm);
						score = Math.max(score, relationScore * secondaryScore);
					}
				}
			});
		}

		// Leaf node
		else if (planNodeType === this._planNodeType.LEAF) {
			let scorer = this._getScorer(planNode.scorer);
			if (scorer) {
				if (this._isDebug){log.debug(`${logMsgPrefix} ${scorer.name} ${planNode.value}`)}
				score = scorer.score(elm, planNode.value);
			}
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

	_getAllElements() {
		let elms = [];
		let id = 0;
		let relevantDomElms = this._htmlDom.getRelevantDomElms();
		relevantDomElms.forEach( de => {
			let elm = new Element(id, de);
			elms.push(elm);
			id++;
		});
		return elms;
	}

	_finalizeScores() {
		let maxScore = Math.max.apply(null, this._allElms.map( e => e.score ));
		if (this._isDebug){log.debug(`Max score for normalizing is ${maxScore}`)}
		this._allElms.forEach( e => {
			if (e.score > this._pruneScore) {
				e.score = maxScore ? Math.round(e.score / maxScore * 100) / 100 : 0;
			} else {
				e.score = 0;
			}
			if (this._isDebug){log.debug(`Final score for ${e.tagName} ${e.id} is ${e.score}`)}
		});
	}

	_prepareOutput(startTime) {
		let scoringResult = {
			duration: (new Date().getTime() - startTime.getTime()) + 'ms',
			elements: []
		};
		this._allElms.forEach( e => {
			if (e.score > 0) {
				scoringResult.elements.push(e.reportData());
			}
		});
		return scoringResult;
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
		this._htmlDom.artemisIdsExistOnHtmlDom = true;

		// Score each element
		this._allElms.forEach( e => {
			if (this._isDebug){log.debug(`Scoring ${e.tagName} ${e.id} - start`)}
			e.score = this._recursiveGetScore(scoringPlan.object, e);
			if (this._isDebug){log.debug(`Scoring ${e.tagName} ${e.id} - end`)}
		});

		// Finalize scores
		this._finalizeScores();

		// Add element scores to HTML DOM
		this._allElms.forEach( e => {HtmlDOM.markElmScoreOnHtmlDom(e.domElm, e.score);});
		this._htmlDom.artemisScoresExistOnHtmlDom = true;

		// Prepare output
		let scoringResult = this._prepareOutput(startTime);
		if (this._isDebug){log.debug(`scoringResult: ${Helper.toJSON(scoringResult)}`)}
		if (this._isDebug){log.debug('Scorer.score() - end')}
		return scoringResult;
	}

}
