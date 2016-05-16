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

  constructor(settings){
    this._settings = settings;
    this._scorersMap = new Map();
    this._registerScorers();
    this._planNodeType = {
      AND: 'AND',
      OR: 'OR',
      RELATION: 'RELATION',
      LEAF: 'LEAF',
      UNKNOWN: 'UNKNOWN'
    }
  }

  _registerScorers() {
    this._scorersMap.set('css-class', new CssClassScorer('css-class', this._settings));
    this._scorersMap.set('css-style-name-and-val', new CssStyleNameAndValScorer('css-style-name-and-val', this._settings));
    this._scorersMap.set('elm-color', new ElmColorScorer('elm-color', this._settings));
    this._scorersMap.set('elm-location', new ElmLocationScorer('elm-location', this._settings));
    this._scorersMap.set('elm-ordinal', new ElmOrdinalScorer('elm-ordinal', this._settings));
    this._scorersMap.set('elm-size', new ElmSizeScorer('elm-size', this._settings));
    this._scorersMap.set('free-text', new FreeTextScorer('free-text', this._settings));
    this._scorersMap.set('html-attr-name-and-val', new HtmlAttrNameAndValScorer('html-attr-name-and-val', this._settings));
    this._scorersMap.set('html-attr-name', new HtmlAttrNameScorer('html-attr-name', this._settings));
    this._scorersMap.set('html-attr-val', new HtmlAttrValScorer('html-attr-val', this._settings));
    this._scorersMap.set('html-tag', new HtmlTagScorer('html-tag', this._settings));
    this._scorersMap.set('rel-position', new RelPositionScorer('rel-position', this._settings));
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
    log.debug(`${elm.tagName} ${elm.id} planNodeType: ${planNodeType} - start`);
    let score = 0;
    let weight = planNode.weight;
    if (!weight && weight !== 0) {
      weight = 1;
    }

    // Node with 'and' items
    if (planNodeType === this._planNodeType.AND) {
      score = 1;
      planNode.and.forEach( n => {
        score *= this._recursiveGetScore(n, elm);
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
            log.debug(`${scorer.name} relation score between ${elm.tagName} ${elm.id} and ${secondaryElm.tagName} ${secondaryElm.id} is ${relationScore}`);
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
        log.debug(`${scorer.name}`);
        score = scorer.score(elm, planNode.value);
      }
    }

    // Unknown node
    else {
      log.error(`Unknown plan node type: ${Helper.toJSON(planNode)}`);
    }

    score *= weight;

    log.debug(`${elm.tagName} ${elm.id} planNodeType: ${planNodeType} - end. weight: ${weight}, score: ${score}`);
    return score;
  }

  _getAllElements(htmlDom) {
    let elms = [];
    let id = 0;
    let relevantDomElms = htmlDom.getRelevantDomElms();
    relevantDomElms.forEach( de => {
      let elm = new Element(id, de);
      elms.push(elm);
      id++;
    });
    return elms;
  }

  _normalizeScores() {
    let maxScore = Math.max.apply(null, this._allElms.map( e => e.score ));
    log.debug(`Max score for normalizing is ${maxScore}`);
    this._allElms.forEach( e => {
      e.score = maxScore ? Math.round(e.score / maxScore*100)/100 : 0;
      log.debug(`Final score for ${e.tagName} ${e.id} is ${e.score}`);
    });
  }

  _prepareOutput(startTime) {
    let maxScoreElements = [];
    this._allElms.forEach( e => {
      if (e.score === 1) {
        maxScoreElements.push(e);
      }
    });
    let scoringResult = {
      duration: (new Date().getTime() - startTime.getTime()) + 'ms',
      isSingleMatch: maxScoreElements.length === 1,
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
    log.debug('Scorer.score() - start');
    let startTime = new Date();
    let htmlDom = new HtmlDOM();

    // Clean HTML DOM
    htmlDom.cleanDom();

    // Get all elements
    this._allElms = this._getAllElements(htmlDom);

    // Add attribute to HTML DOM body
    htmlDom.addArtemisBodyAttr();

    // Add element ids to HTML DOM
    this._allElms.forEach( e => {e.markIdOnHtmlDom(); });

    // Score each element
    this._allElms.forEach( e => {
      log.debug(`Scoring ${e.tagName} ${e.id} - start`);
      e.score = this._recursiveGetScore(scoringPlan.object, e);
      log.debug(`Scoring ${e.tagName} ${e.id} - end`);
    });

    // Normalize scores
    this._normalizeScores();

    // Add element scores to HTML DOM
    this._allElms.forEach( e => { e.markScoreOnHtmlDom(); });

    // Prepare output
    let scoringResult = this._prepareOutput(startTime);

    log.debug(`scoringResult: ${Helper.toJSON(scoringResult)}`);
    log.debug('Scorer.score() - end');
    return scoringResult;
  }

}
