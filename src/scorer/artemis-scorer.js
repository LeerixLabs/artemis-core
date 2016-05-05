import {IGNORED_TAGS} from '../common/common-constants';
import {ARTEMIS_SCORE_ATTR} from '../common/common-constants';
import {ARTEMIS_CLASS} from '../common/common-constants';
import {log} from '../common/logger';
import {HtmlDOM} from './../common/html-dom';
import {Element} from './../common/element';
import CssClassScorer from './scorers/css-class-scorer.js';
import HtmlAttrNameAndValScorer from './scorers/html-attr-name-and-val-scorer.js';
import HtmlAttrNameScorer from './scorers/html-attr-name-scorer.js';
import HtmlAttrValScorer from './scorers/html-attr-val-scorer.js';
import HtmlTagScorer from './scorers/html-tag-scorer.js';
import RelPositionScorer from './scorers/rel-position-scorer.js';
import FreeTextScorer from './scorers/free-text-scorer.js';

export class Scorer{

  constructor(settings){
    this._settings = settings;
    this._scorersMap = new Map();
    this._registerScorers();
  }

  _registerScorers() {
    this._scorersMap.set('css-class', new CssClassScorer());
    this._scorersMap.set('html-attr-name-and-val', new HtmlAttrNameAndValScorer());
    this._scorersMap.set('html-attr-name', new HtmlAttrNameScorer());
    this._scorersMap.set('html-attr-val', new HtmlAttrValScorer());
    this._scorersMap.set('html-tag', new HtmlTagScorer());
    this._scorersMap.set('rel-position', new RelPositionScorer());
    this._scorersMap.set('free-text', new FreeTextScorer());
  }

  score(scoringPlan){
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
      elm.score = this.recursiveScore(scoringPlan.target, elm);
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
    return scoringResult;
  }

  recursiveScore(planNode, elm){
    let score = null;
    let weight = planNode.weight;
    if (!weight && weight !== 0) {
      weight = 1;
    }

    //leaf node
    if (planNode.scorer && !planNode.target) {
      let scorer = this._scorersMap.get(planNode.scorer);
      score = weight * scorer.score(planNode.param, elm);
    }
    //node with 'and' items
    else if (planNode.and){
      for (let i = 0; i < planNode.and.length; i++) {
        score = (score !== null) ? score * this.recursiveScore(planNode.and[i], elm)
        : this.recursiveScore(planNode.and[i], elm);
      }
      if (weight > 0) {
        score *= weight;
      }
    }
    //node with 'or' items
    else if (planNode.or) {
      let partScore = [];
      for (let i = 0; i < planNode.or.length; i++) {
        let result = this.recursiveScore(planNode.or[i], elm);
        partScore.push(result);
      }
      score = Math.max.apply(null, partScore);
    }
    //next node with target
    else if (planNode.scorer && planNode.target) {
      let maxScore = 0;
      for (let i=0; i<this._allElms.length; i++) {
        let secondaryElm = this._allElms[i];
        if (elm !== secondaryElm) {
          let scorer = this._scorersMap.get(planNode.scorer);
          let relationScore = scorer.score(planNode.param, elm, secondaryElm, this._html.bodyRect);
          let planItemNode = planNode.target;
          let secondaryScore = this.recursiveScore(planItemNode, secondaryElm);
          maxScore = Math.max(maxScore, weight * relationScore * secondaryScore);
        }
      }
      score = weight * maxScore;
    }
    return score;
  }

}
