export class ScorerHelper {

  static stringMatchScores(datas, standard, allowPartialMatch) {
    var i;
    var score = 0;
    if (standard instanceof Array) {
      standard.forEach(param => {
        for (i = 0; i < datas.length; i++) {
          score = Math.max(score, ParamAnalyzer.stringMatchScore(datas[i], param, allowPartialMatch));
        }
      });
      return score;
    }
    for (i = 0; i < datas.length; i++) {
      score = Math.max(score, ParamAnalyzer.stringMatchScore(datas[i], standard, allowPartialMatch));
    }
    return score;
  }

  static stringMatchScore(data, standard, allowPartialMatch) {
    var score = 0;
    if (!data) {
      return 0;
    }
    var dat = ParamAnalyzer.pascalCase(data).toLowerCase();
    var str = ParamAnalyzer.pascalCase(standard).toLowerCase();
    if (dat.indexOf(str) === -1) {
      return 0;
    }
    if (allowPartialMatch) {
      score = str.length / dat.length;
      if (score < 0.1) {
        score = 0;
      }
    } else if (str.length === dat.length) {
      score = 1;
    }
    return score;
  }

  static pascalCase(str) {
    if (!str) {
      return '';
    }
    return str.trim().replace(/_/g, '-').replace(/\-/g, ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '').replace(/^[a-z]/, function(m) {
      return m.toUpperCase();
    });
  }

}
