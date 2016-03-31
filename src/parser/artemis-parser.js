import {settings} from './../settings';
import {helpers} from './helpers';
import cnst from './consts';
export class Parser {

	 constructor(settings) {
        var that = this;
        that.settings = settings;
	 }
     parse(text) {
            var words = [];
            var strs, str, wordLowerCase, i, insideQuotes, txt;
            txt = text;
            txt = txt.replace(/\b(with tag|and tag|or tag)\b/gi, cnst.keyword.TAG);
            txt = txt.replace(/\b(with class|and class|or class)\b/gi, cnst.keyword.CLASS);
            txt = txt.replace(/\b(with style|and style|or style)\b/gi, cnst.keyword.STYLE);
            txt = txt.replace(/\b(with attribute value|and attribute value|or attribute value|with attr value|and attr value|or attr value)\b/gi, cnst.keyword.ATTR_VALUE);
            txt = txt.replace(/\b(with attribute|and attribute|or attribute|with attr|and attr|or attr)\b/gi, cnst.keyword.ATTR_NAME);
            txt = txt.replace(/\b(equals to)\b/gi, cnst.keyword.ATTR_EQUALS);
            txt = txt.replace(/\b(with type|and type|or type)\b/gi, cnst.keyword.WITH_TYPE);
            txt = txt.replace(/\b(with identity|and identity|or identity)\b/gi, cnst.keyword.IDENTITY);
            txt = txt.replace(/\b(with text|and text|or text)\b/gi, cnst.keyword.TEXT);
            txt = txt.replace(/\b(at the top)\b/gi, cnst.keyword.AT_THE_TOP);
            txt = txt.replace(/\b(at the bottom)\b/gi, cnst.keyword.AT_THE_BOTTOM);
            txt = txt.replace(/\b(on the left)\b/gi, cnst.keyword.ON_THE_LEFT);
            txt = txt.replace(/\b(on the right)\b/gi, cnst.keyword.ON_THE_RIGHT);
            txt = txt.replace(/\b(on the middle)\b/gi, cnst.keyword.ON_THE_MIDDLE);
            txt = txt.replace(/\b(right of)\b/gi, cnst.keyword.RIGHT_OF);
            txt = txt.replace(/\b(left of)\b/gi, cnst.keyword.LEFT_OF);
            txt = txt.replace(/\b(the toolbar)\b/gi, cnst.keyword.TOOLBAR);
            strs = txt.split(' ');
            insideQuotes = false;
            for (i = 0; i < strs.length; i++) {
                str = strs[i];
                if (str === '') {
                    continue;
                }
                if (helpers.quoted(str)) {
                    words.push(str);
                } else if (helpers.quoteStart(str) && !helpers.quoteEnd(str)) {
                    words.push(str);
                    insideQuotes = true;
                } else if (helpers.quoteEnd(str) && !helpers.quoteStart(str)) {
                    words[words.length - 1] += (' ' + str);
                    insideQuotes = false;
                } else if (insideQuotes) {
                    words[words.length - 1] += (' ' + str);
                } else {
                    words.push(str);
                }
            }
            for (i = 0; i < words.length; i++) {
                if (helpers.quoted(words[i])) {
                    words[i] = helpers.unQuote(words[i]);
                    continue;
                }
                wordLowerCase = words[i].toLowerCase();
                if (wordLowerCase === 'small') { words[i] = cnst.keyword.SMALL; }
                if (wordLowerCase === 'medium') { words[i] = cnst.keyword.MEDIUM; }
                if (wordLowerCase === 'large') { words[i] = cnst.keyword.LARGE; }
                if (wordLowerCase === 'element' || wordLowerCase === 'elm') { words[i] = cnst.keyword.ELEMENT; }
                if (wordLowerCase === 'button' || wordLowerCase === 'btn') { words[i] = cnst.keyword.BUTTON; }
                if (wordLowerCase === 'link' || wordLowerCase === 'lnk' || wordLowerCase === 'dropdown' || wordLowerCase === 'item') { words[i] = cnst.keyword.LINK; }
                if (wordLowerCase === 'input' || wordLowerCase === 'inp') { words[i] = cnst.keyword.INPUT; }
                if (wordLowerCase === 'checkbox' || wordLowerCase === 'chk') { words[i] = cnst.keyword.CHECKBOX; }
                if (wordLowerCase === 'label' || wordLowerCase === 'lbl') { words[i] = cnst.keyword.LABEL; }
                if (wordLowerCase === 'image' || wordLowerCase === 'img') { words[i] = cnst.keyword.IMAGE; }
                if (wordLowerCase === 'panel' || wordLowerCase === 'pnl') { words[i] = cnst.keyword.PANEL; }
                //if (wordLowerCase === 'item') { words[i] = cnst.keyword.ITEM; }
                if (wordLowerCase === 'toolbar') { words[i] = cnst.keyword.TOOLBAR; }
                if (wordLowerCase === 'above') { words[i] = cnst.keyword.ABOVE; }
                if (wordLowerCase === 'below') { words[i] = cnst.keyword.BELOW; }
                if (wordLowerCase === 'near') { words[i] = cnst.keyword.NEAR; }
                if (wordLowerCase === 'inside') { words[i] = cnst.keyword.INSIDE; }
                if (wordLowerCase === 'equals') { words[i] = cnst.keyword.ATTR_EQUALS; }
            }
            return words;
        }
    }



