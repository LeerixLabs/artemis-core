import {IGNORED_TAGS} from '../common/common-constants';
import {ARTEMIS_SCORE_ATTR} from '../common/common-constants';
import {ARTEMIS_CLASS} from '../common/common-constants';
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

  _recursiveGetScore(planNode, elm){
    let score = 0;
    let weight = planNode.weight;
    if (!weight && weight !== 0) {
      weight = 1;
    }

    // Node with 'and' items
    if (planNode.and) {
      score = 1;
      planNode.and.forEach( n => {
        score *= this._recursiveGetScore(n, elm);
      });
    }

    // Node with 'or' items
    else if (planNode.or) {
      score = 0;
      planNode.or.forEach( n => {
        score = Math.max(score, this._recursiveGetScore(n, elm));
      });
    }

    // Node with object
    else if (planNode.object) {
      score = 0;
      this._allElms.forEach( secondaryElm => {
        if (elm.id !== secondaryElm.id) {
          let scorer = this._getScorer(planNode.scorer);
          if (scorer) {
            let relationScore = scorer.score(planNode.value, elm, secondaryElm);
            let secondaryScore = this._recursiveGetScore(planNode.object, secondaryElm);
            score = Math.max(score, relationScore * secondaryScore);
          }
        }
      });
    }

    // Leaf node
    else if (planNode.scorer) {
      let scorer = this._getScorer(planNode.scorer);
      if (scorer) {
        score = scorer.score(planNode.value, elm);
      }
    }

    // Unknown node
    else {
      log.error(`Unknown plan node type: ${Helper.toJSON(planNode)}`);
    }

    score *= weight;

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
