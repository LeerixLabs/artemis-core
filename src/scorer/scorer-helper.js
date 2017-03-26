export default class ScorerHelper {

  static isArray(variable) {
    return variable.constructor === Array;
  }

  static pascalCase(str) {
    if (!str) {
      return '';
  }
    return str.trim().replace(/_/g, '-').replace(/\-/g, ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '').replace(/^[a-z]/, function(m){ return m.toUpperCase(); });
  }

  static stringMatchScore(searchIn, searchFor, allowPartialMatch, NeedToNormalize) {
    let score = 0;
    if (searchIn) {
      let searchInStr = NeedToNormalize ? ScorerHelper.pascalCase(searchIn).toLowerCase() : searchIn;
      let searchForStr = NeedToNormalize ? ScorerHelper.pascalCase(searchFor).toLowerCase() : searchFor;
      let index = searchInStr.indexOf(searchForStr);
      if (!allowPartialMatch && index === 0 && searchInStr.length === searchForStr.length) {
        score = 1;
      } else if (allowPartialMatch && index > -1 ) {
        score = searchForStr.length / searchInStr.length;
        if (score < 0.1) {
          score = 0;
        }
      }
    }
    return score;
  }

  static multiStringMatchScore(searchIn, searchFor, allowPartialMatch) {
    if (!searchIn || !searchFor) {
      return 0;
    }
    let score = 0;
    let searchInArr = ScorerHelper.isArray(searchIn) ? searchIn : [searchIn];
    for (let i = 0; i < searchInArr.length; i++) {
      searchInArr[i] = ScorerHelper.pascalCase(searchInArr[i]).trim().toLowerCase();
    }
    let searchForArr = ScorerHelper.isArray(searchFor) ? searchFor : [searchFor];
    for (let i = 0; i < searchForArr.length; i++) {
      searchForArr[i] = ScorerHelper.pascalCase(searchForArr[i]).trim().toLowerCase();
    }
    searchInArr.forEach( si => {
      searchForArr.forEach( sf => {
        let tmpScore = ScorerHelper.stringMatchScore(si, sf, allowPartialMatch, false);
        score = Math.max(score, tmpScore);
      });
    });
    return score;
  }

  static getMaxScore(scoreArray) {
    if (!scoreArray || scoreArray.length === 0) {
      return 0;
    }
    return Math.max.apply(null, scoreArray);
  }

  static getBoundScore(score) {
    return Math.min(Math.max(0, score), 1.0);
  }

  static getPartialScore(value, maxValue, reversed) {
    let score = maxValue > 0 ? Math.min(Math.max(0, value / maxValue), 1.0) : 0;
    return reversed ? 1 - score : score;
  }

}
