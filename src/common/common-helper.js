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

  static isString(str1, str2){
      return typeof str1 == 'string' && typeof str2 == 'string' && str1.length &&  str2.length; 
  }


  static startsWith(str1, str2) {
    return this.isString(str1, str2) ? str1.indexOf(str2) === 0 : false;
  }

  static endsWith(str1, str2) {
    return this.isString(str1, str2) ? str1.indexOf(str2, str1.length - str2.length) !== -1 : false;
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

  goHelp(displayAlert) {
    var msg = 'Artemis' + '\n\n---------- Execution ----------\nImmediate: Shift+a | Delayed: Shift+s' + '\n\n---------- Ordinal ----------\n1st | 2nd | 3rd\n' + '\n\n---------- Target Adjectives ----------\nsmall | medium | large\n<free text>' + '\n\n---------- Target Type ----------\nelement | button | link | input | checkbox | label | image | dropdown | item | panel | toolbar' + '\n\n---------- Target Properties----------\nwith tag X\nwith class X\nwith style X:Y\nwith attribute X\nwith attribute value X\nwith attribute X equals to Y\nwith type X\nwith identity X\nwith text X\nat the top | at the bottom\non the left | on the right | on the middle' + '\n\n---------- Target-to-Target Relations ----------\nleft of | right of | above | below | near | inside <other target phrase>' + '\n\n---------- Examples ----------\nelement with tag div and class selected-tab\nsave button at the top\nlarge address input\nimage left of filter label' + '\n\n* For multiple non-reserved keywords, surround with single quotes / double quotes / tildes, or separate words by dashes e.g. \'save all\' button, or save-all button.';
    this.___DBG(msg);
    if (displayAlert) {
      // html.window.alert(msg);
      alert(msg);
    }
  }
}
