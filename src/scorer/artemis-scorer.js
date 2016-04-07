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

    //Weigh each element
    for (let elem of this._allElms){
      //Parse JSON plan and weigh element
      elem.weight = this.recursiveScore( JSON.parse(scoringPlan), elem);
      scoringResult.elements.push(elem);
      i++;
    }

    //Get maximum Score
    let arrWeights = scoringResult.elements.map(elm => elm.weight);
    let maxWeight = Math.max.apply( null, arrWeights );

    //Set endScore to element
    for (let i = 0; i < scoringResult.elements.length; i++) {
      let d =(scoringResult.elements[i].weight / maxWeight).toFixed(2);
      scoringResult.elements[i].score = maxWeight ? ((scoringResult.elements[i].weight / maxWeight).toFixed(2)) : 0;
    }
    //Set unique param to element
    Scorer.isUniqueElement(scoringResult.elements);

    let endTime = new Date();

    scoringResult.duration = endTime.getTime() - startTime.getTime();
    return scoringResult;
  }

  static isUniqueElement(arrElms){
      let isUnique = arrElms.filter(elem => {
          return +CssClassScorer.score === 1;
      });
      isUnique[0].unicue = isUnique.length===1;
  }

  recursiveScore(planNode, elem){
      let weight = planNode.weight;
      let score = null;
      let paramAnalyzer = new ParamAnalyzer();

      //start node
      if(planNode.target && !planNode.scorer){
          score = (score !== null) ? score * this.recursiveScore(planNode.target, elem)
              : this.recursiveScore(planNode.target, elem);
      }
      //end node
      else if(planNode.scorer && !planNode.target) {
          if(!weight && weight!==0){
              throw new Error("Not found weight in Node Plans: "+ planNode);
          }
          let relationScore = paramAnalyzer.analyzeScorerParam(planNode.scorer, planNode.param, elem);
          score = weight * relationScore;
      }
      //node with node.and
      else if(planNode.and){
          for (var i = 0; i < planNode.and.length; i++) {
              score = (score !== null) ? score * this.recursiveScore(planNode.and[i], elem)
              : this.recursiveScore(planNode.and[i], elem);
          }
          if(weight > 0){
              score *= weight;
          }
      }
      //node with node.or
      else if (planNode.or){
          let partScore = [];
          for (var i = 0; i < planNode.or.length; i++) {
              let result = this.recursiveScore(planNode.or[i], elem);
              partScore.push(result);
          }
          score = Math.max.apply(null, partScore);
      }
      //next node with target
      else if(planNode.scorer && planNode.target){
          if(!weight && weight!==0){
              throw new Error("Not found weight in Node Plans: " + planNode);
          }

          let maxScore = 0;
          for (i=0; i<this._allElms.length; i++) {
              let secondaryElm = this._allElms[i];
              if (elem !== secondaryElm) {
                  planNode.targetElem = secondaryElm;
                  let relationScore = paramAnalyzer.analyzeScorerParam(planNode.scorer, planNode.param, elem, secondaryElm, this._html.bodyRect);
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
