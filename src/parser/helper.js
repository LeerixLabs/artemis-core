export class Helper {

  ___LOG(msg) {
    // html.console.log('ARTEMIS ' + msg);
  }

  ___DBG(msg) {
    this.___LOG('DBG ' + msg);
  }

  ___WRN(msg) {
    this.___LOG('WRN ' + msg);
  }

  static startsWith(str1, str2) {
    return _.isString(str1) && !_.isEmpty(str1) && _.isString(str2) && !_.isEmpty(str2) ? str1.indexOf(str2) === 0 : false;
  }

  static endsWith(str1, str2) {
    return _.isString(str1) && !_.isEmpty(str1) && _.isString(str2) && !_.isEmpty(str2) ? str1.indexOf(str2, str1.length - str2.length) !== -1 : false;
  }

  static quoteStart(str) {
    return Helper.startsWith(str, '"') || Helper.startsWith(str, '\'') || Helper.startsWith(str, '~');
  }

  static quoteEnd(str) {
    return Helper.endsWith(str, '"') || Helper.endsWith(str, '\'') || Helper.endsWith(str, '~');
  }

  static quoted(str) {
    return Helper.startsWith(str, '"') && Helper.endsWith(str, '"') || Helper.startsWith(str, '\'') && Helper.endsWith(str, '\'') || Helper.startsWith(str, '~') && Helper.endsWith(str, '~');
  }

  static unQuote(str) {
    if (!str) {
        return '';
    }
    if (!Helper.quoted(str)) {
        return str;
    }
    return str.slice(1, str.length - 1);
  }

  static pascalCase(str) {
    if (!str) {
        return '';
    }
    return str.trim().replace(/_/g, '-').replace(/\-/g, ' ').replace(/(?:^\w|[A-Z]|\b\w)/g,  (letter, index) =>{
        return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '').replace(/^[a-z]/,  m => {
        return m.toUpperCase();
    });
  }

  static stringMatchScore(data, string, allowPartialMatch) {
    var score = 0;
    if (!data) {
        return 0;
    }
    var dat = Helper.pascalCase(data).toLowerCase();
    var str = Helper.pascalCase(string).toLowerCase();
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

  static stringMatchScores(datas, string, allowPartialMatch) {
    var i;
    var score = 0;
    for (i = 0; i < datas.length; i++) {
        score = Math.max(score, Helper.stringMatchScore(datas[i], string, allowPartialMatch));
    }
    return score;
  }

  static getBoundScore(score) {
    return Math.min(Math.max(0, score), 1.0);
  }

  static isElmInsideElm(elm1, elm2) {
    var isInside = false;
    var elmRect1 = elm1.getRect();
    var elmRect2 = elm2.getRect();
    if (elmRect1.width === 0 || elmRect1.height === 0 || elmRect2.width === 0 || elmRect2.height === 0) {
        return isInside;
    }
    if (elmRect1.left >= elmRect2.left && elmRect1.top >= elmRect2.top && elmRect1.right <= elmRect2.right && elmRect1.bottom <= elmRect2.bottom) {
        isInside = true;
    }
    return isInside;
  }

  static getPartialScore(value, maxValue, reversed) {
    var score = maxValue > 0 ? Math.min(Math.max(0, value / maxValue), 1.0) : 0;
    return reversed ? 1 - score : score;
  }

  normalizeElmsScores(elmsScores) {
    var maxScore = 0;
    _.forEach(elmsScores,  elmScore => {
        maxScore = Math.max(maxScore, elmScore.score);
    });
    if (maxScore > 0) {
        _.forEach(elmsScores,  elmScore => {
            elmScore.score = elmScore.score > 0 ? Math.round(elmScore.score / maxScore * 1000000000) / 1000000000 : 0;
        });
    }
  }

  goHelp(displayAlert) {
    var msg = 'Artemis' + '\n\n---------- Execution ----------\nImmediate: Shift+a | Delayed: Shift+s' + '\n\n---------- Ordinal ----------\n1st | 2nd | 3rd\n' + '\n\n---------- Target Adjectives ----------\nsmall | medium | large\n<free text>' + '\n\n---------- Target Type ----------\nelement | button | link | input | checkbox | label | image | dropdown | item | panel | toolbar' + '\n\n---------- Target Properties----------\nwith tag X\nwith class X\nwith style X:Y\nwith attribute X\nwith attribute value X\nwith attribute X equals to Y\nwith type X\nwith identity X\nwith text X\nat the top | at the bottom\non the left | on the right | on the middle' + '\n\n---------- Target-to-Target Relations ----------\nleft of | right of | above | below | near | inside <other target phrase>' + '\n\n---------- Examples ----------\nelement with tag div and class selected-tab\nsave button at the top\nlarge address input\nimage left of filter label' + '\n\n* For multiple non-reserved keywords, surround with single quotes / double quotes / tildes, or separate words by dashes e.g. \'save all\' button, or save-all button.';
    this.___DBG(msg);
    if (displayAlert) {
      // html.window.alert(msg);
      alert(msg);
    }
  }
}
