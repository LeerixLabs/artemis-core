import constants from './parser-constants';
import {Helper} from './../common/common-helper';

export class Parser {

  constructor(settings) {
    this._settings = settings;
  }

  parse(text) {
    let settings = this._settings;
    var words = [];
    var strs, str, wordLowerCase, i, insideQuotes, txt;
    txt = text;
    txt = txt.replace(/\b(with tag|and tag|or tag)\b/gi, constants.keyword.TAG);
    txt = txt.replace(/\b(with class|and class|or class)\b/gi, constants.keyword.CLASS);
    txt = txt.replace(/\b(with style|and style|or style)\b/gi, constants.keyword.STYLE);
    txt = txt.replace(/\b(with attribute value|and attribute value|or attribute value|with attr value|and attr value|or attr value)\b/gi, constants.keyword.ATTR_VALUE);
    txt = txt.replace(/\b(with attribute|and attribute|or attribute|with attr|and attr|or attr)\b/gi, constants.keyword.ATTR_NAME);
    txt = txt.replace(/\b(equals to)\b/gi, constants.keyword.ATTR_EQUALS);
    txt = txt.replace(/\b(with type|and type|or type)\b/gi, constants.keyword.WITH_TYPE);
    txt = txt.replace(/\b(with identity|and identity|or identity)\b/gi, constants.keyword.IDENTITY);
    txt = txt.replace(/\b(with text|and text|or text)\b/gi, constants.keyword.TEXT);
    txt = txt.replace(/\b(at the top)\b/gi, constants.keyword.AT_THE_TOP);
    txt = txt.replace(/\b(at the bottom)\b/gi, constants.keyword.AT_THE_BOTTOM);
    txt = txt.replace(/\b(on the left)\b/gi, constants.keyword.ON_THE_LEFT);
    txt = txt.replace(/\b(on the right)\b/gi, constants.keyword.ON_THE_RIGHT);
    txt = txt.replace(/\b(on the middle)\b/gi, constants.keyword.ON_THE_MIDDLE);
    txt = txt.replace(/\b(right of)\b/gi, constants.keyword.RIGHT_OF);
    txt = txt.replace(/\b(left of)\b/gi, constants.keyword.LEFT_OF);
    txt = txt.replace(/\b(the toolbar)\b/gi, constants.keyword.TOOLBAR);
    strs = txt.split(' ');
    insideQuotes = false;
    for (i = 0; i < strs.length; i++) {
        str = strs[i];
        if (str === '') {
            continue;
        }
        if (Helper.quoted(str)) {
            words.push({value:str});
        } else if (Helper.quoteStart(str) && !Helper.quoteEnd(str)) {
            words.push({value:str});
            insideQuotes = true;
        } else if (Helper.quoteEnd(str) && !Helper.quoteStart(str)) {
            words[words.length - 1].value += (' ' + str);
            insideQuotes = false;
        } else if (insideQuotes) {
            words[words.length - 1].value += (' ' + str);
        } else {
            words.push({value:str});
        }
    }
    for (i = 0; i < words.length; i++) {
        if (Helper.quoted(words[i].value)) {
            words[i].value = Helper.unQuote(words[i].value);
            continue;
        }
        wordLowerCase = words[i].value.toLowerCase();
        if (wordLowerCase === 'small') { words[i].value = constants.keyword.SMALL; }
        if (wordLowerCase === 'medium') { words[i].value = constants.keyword.MEDIUM; }
        if (wordLowerCase === 'large') { words[i].value = constants.keyword.LARGE; }
        if (wordLowerCase === 'element' || wordLowerCase === 'elm') { words[i].value = constants.keyword.ELEMENT; }
        if (wordLowerCase === 'button' || wordLowerCase === 'btn') { words[i].value = constants.keyword.BUTTON; }
        if (wordLowerCase === 'link' || wordLowerCase === 'lnk' || wordLowerCase === 'dropdown' || wordLowerCase === 'item') { words[i].value = constants.keyword.LINK; }
        if (wordLowerCase === 'input' || wordLowerCase === 'inp') { words[i].value = constants.keyword.INPUT; }
        if (wordLowerCase === 'checkbox' || wordLowerCase === 'chk') { words[i].value = constants.keyword.CHECKBOX; }
        if (wordLowerCase === 'label' || wordLowerCase === 'lbl') { words[i].value = constants.keyword.LABEL; }
        if (wordLowerCase === 'image' || wordLowerCase === 'img') { words[i].value = constants.keyword.IMAGE; }
        if (wordLowerCase === 'panel' || wordLowerCase === 'pnl') { words[i].value = constants.keyword.PANEL; }
        //if (wordLowerCase === 'item') { words[i] = constants.keyword.ITEM; }
        if (wordLowerCase === 'toolbar') { words[i].value = constants.keyword.TOOLBAR; }
        if (wordLowerCase === 'above') { words[i].value = constants.keyword.ABOVE; }
        if (wordLowerCase === 'below') { words[i].value = constants.keyword.BELOW; }
        if (wordLowerCase === 'near') { words[i].value = constants.keyword.NEAR; }
        if (wordLowerCase === 'inside') { words[i].value = constants.keyword.INSIDE; }
        if (wordLowerCase === 'equals') { words[i].value = constants.keyword.ATTR_EQUALS; }
    }
    //words = words.map((x)=>{return {value:x};});
    return words;
  }
}
