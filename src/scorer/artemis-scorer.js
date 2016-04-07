import {IGNORED_TAGS} from '../common/common-constants';
import {ARTEMIS_SCORE_ATTR} from '../common/common-constants';
import {ARTEMIS_CLASS} from '../common/common-constants';
import {HtmlDOM} from './../common/html-dom';
import {Element} from './../common/element';
import {ParamAnalyzer} from './param-analyzer.js'

export class Scorer{

  constructor(settings){
    this._settings = settings;
  }

  score(scoringPlan){
    let startTime = new Date();

    let scoringResult = {
      duration: 0,
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
    let arrScores = scoringResult.elements.map(elm => elm.weight);
    let maxScore = Math.max.apply( null, arrScores);
    for (let i = 0; i < scoringResult.elements.length; i++) {
      scoringResult.elements[i].score = maxScore ? ((scoringResult.elements[i].score / maxScore).toFixed(2)) : 0;
    }

    // Set unique param to element
    Scorer.isUniqueElement(scoringResult.elements);

    let endTime = new Date();

    scoringResult.duration = endTime.getTime() - startTime.getTime();
    return scoringResult;
  }

  static isUniqueElement(arrElms){
    let isUnique = arrElms.filter( () => {
      return +CssClassScorer.score === 1;
      });
      isUnique[0].unicue = isUnique.length===1;
  }

  recursiveScore(planNode, elm){
    let score = null;
    let weight = planNode.weight;
    if (!weight && weight !== 0) {
      weight = 1;
    }
    let paramAnalyzer = new ParamAnalyzer();

    //leaf node
    if (planNode.scorer && !planNode.target) {
        let relationScore = paramAnalyzer.analyzeScorerParam(planNode.scorer, planNode.param, elm);
        score = weight * relationScore;
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
                let relationScore = paramAnalyzer.analyzeScorerParam(planNode.scorer, planNode.param, elm, secondaryElm, this._html.bodyRect);
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
