export default class Helper {

  static toJSON(object) {
    return JSON.stringify(object, null, 4);
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

}
