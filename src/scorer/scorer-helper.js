export class ScorerHelper {

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

  static stringMatchScore(searchIn, searchFor, allowPartialMatch) {
    let score = 0;
    if (searchIn) {
      let searchInStr = ScorerHelper.pascalCase(searchIn).toLowerCase();
      let searchForStr = ScorerHelper.pascalCase(searchFor).toLowerCase();
      let index = searchInStr.indexOf(searchForStr);
      if (!allowPartialMatch && index === 0) {
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

  static getMaxScore(scoreArray) {
    if (!scoreArray || scoreArray.length === 0) {
      return 0;
    }
    return Math.max.apply(null, scoreArray);
  }

  static getBoundScore(score) {
    return Math.min(Math.max(0, score), 1.0);
  }

}
