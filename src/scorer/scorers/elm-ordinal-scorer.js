export default class ElmOrdinalScorer {

  constructor(name, settings){
    this.name = name;
    this._settings = settings;
    this._minScore = settings.minScore || 1;
  }

  score(elm, val) {
     return 1;
  }

  getOrdinalElm(allElms, targetIndex, val) {
    if (!allElms || targetIndex < 0 || !val || val < 1) {
      return null;
    }
    let elm = null;
    let relevantElms = [];
	allElms.forEach( e => {
	  if (e.scores[targetIndex] >= this._minScore) {
		  relevantElms.push(e);
      }
	});
	if (val <= relevantElms.length) {
	  elm  = relevantElms[val - 1];
    }
    return elm;
  }

}

