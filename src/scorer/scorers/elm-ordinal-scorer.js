export default class ElmOrdinalScorer {

  constructor(name, settings){
    this.name = name;
    this._settings = settings;
    this._minScore = settings['min-score'] || 1;
  }

  score(elm, val) {
     return 1;
  }

  getOrdinalElm(allElms, val) {
    if (!allElms || !val || val < 1) {
      return null;
    }
    let elm = null;
    let relevantElms = [];
	allElms.forEach( e => {
	  if (e.score >= this._minScore) {
		  relevantElms.push(e);
      }
	});
	if (val <= relevantElms.length) {
	  elm  = relevantElms[val - 1];
    }
    return elm;
  }

}

