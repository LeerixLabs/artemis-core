import {IGNORED_TAGS} from '../common/common-constants';
import {ARTEMIS_SCORE_ATTR} from '../common/common-constants';
import {ARTEMIS_CLASS} from '../common/common-constants';
import {log} from '../common/logger';
import {Helper} from  '../common/common-helper';
import {HtmlDOM} from './../common/html-dom';
import {Element} from './../common/element';
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
  }

  _registerScorers() {
    this._scorersMap.set('css-class', new CssClassScorer());
    this._scorersMap.set('css-style-name-and-val', new CssStyleNameAndValScorer());
    this._scorersMap.set('elm-color', new ElmColorScorer());
    this._scorersMap.set('elm-location', new ElmLocationScorer());
    this._scorersMap.set('elm-ordinal', new ElmOrdinalScorer());
    this._scorersMap.set('elm-size', new ElmSizeScorer());
    this._scorersMap.set('free-text', new FreeTextScorer());
    this._scorersMap.set('html-attr-name-and-val', new HtmlAttrNameAndValScorer());
    this._scorersMap.set('html-attr-name', new HtmlAttrNameScorer());
    this._scorersMap.set('html-attr-val', new HtmlAttrValScorer());
    this._scorersMap.set('html-tag', new HtmlTagScorer());
    this._scorersMap.set('rel-position', new RelPositionScorer());
  }

  _recursiveGetScore(planNode, elm){
    let score = null;
    let weight = planNode.weight;
    if (!weight && weight !== 0) {
      weight = 1;
    }

    //node with 'and' items
    if (planNode.and){
      for (let i = 0; i < planNode.and.length; i++) {
        score = (score !== null) ? score * this._recursiveGetScore(planNode.and[i], elm)
        : this._recursiveGetScore(planNode.and[i], elm);
      }
      if (weight > 0) {
        score *= weight;
      }
    }

    //node with 'or' items
    else if (planNode.or) {
      let partScore = [];
      for (let i = 0; i < planNode.or.length; i++) {
        let result = this._recursiveGetScore(planNode.or[i], elm);
        partScore.push(result);
      }
      score = Math.max.apply(null, partScore);
    }

    //node with object
    else if (planNode.scorer && planNode.object) {
      let maxScore = 0;
      for (let i=0; i<this._allElms.length; i++) {
        let secondaryElm = this._allElms[i];
        if (elm !== secondaryElm) {
          let scorer = this._scorersMap.get(planNode.scorer);
          let relationScore = scorer.score(planNode.param, elm, secondaryElm, this._html.bodyRect);
          let planItemNode = planNode.object;
          let secondaryScore = this._recursiveGetScore(planItemNode, secondaryElm);
          maxScore = Math.max(maxScore, weight * relationScore * secondaryScore);
        }
      }
      score = weight * maxScore;
    }

    //leaf node
    else if (planNode.scorer) {
      let scorer = this._scorersMap.get(planNode.scorer);
      score = weight * scorer.score(planNode.param, elm);
    }

    //unknown node
    else {
      log.error(`Unknown plan node type: ${Helper.toJSON(planNode)}`);
    }

    return score;
  }

  score(scoringPlan){
    log.debug('Scorer.score() - start');
    let startTime = new Date();

    let scoringResult = {
      duration: 0,
      hasSingleMatch: false,
      elements: []
    };

    // Get relevant elements
    this._html = new HtmlDOM();
    let relevantDomElms = this._html.getRelevantDomElms();
    this._allElms = [];
    for (let i = 0; i < relevantDomElms.length; i++) {
      let elm = new Element(i, relevantDomElms[i]);
      elm.removeAttributeScore();
      this._allElms.push(elm);
    }

    // Score each element
    for (let elm of this._allElms){
      elm.score = this._recursiveGetScore(scoringPlan.object, elm);
      scoringResult.elements.push(elm);
    }

    // Normalize scores
    let arrScores = scoringResult.elements.map(elm => elm.score);
    let maxScore = Math.max.apply( null, arrScores);
    for (let i = 0; i < scoringResult.elements.length; i++) {
      scoringResult.elements[i].score = maxScore ? Math.round(scoringResult.elements[i].score / maxScore*100)/100 : 0;
    }

    // Look for a single match
    let perfectScore = 0;
    scoringResult.elements.forEach( (elm) => {
      if (elm.score === 1) {
        perfectScore++;
      }
    });
    scoringResult.hasSingleMatch = perfectScore === 1;

    let endTime = new Date();

    scoringResult.duration = endTime.getTime() - startTime.getTime();

    log.debug(`scoringResult: ${Helper.toJSON(scoringResult)}`);
    log.debug('Scorer.score() - end');
    return scoringResult;
  }


}
