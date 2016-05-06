import {log} from '../common/logger';

export class Parser {

  constructor(settings) {
    this._settings = settings;
    this._preObjectTypePhrases = this._settings.phrases.filter( p => p.location === 'pre-object-type');
    this._objectTypePhrases = this._settings.phrases.filter( p => p.location === 'object-type');
    this._postObjectTypePhrases = this._settings.phrases.filter( p => p.location === 'post-object-type');
  }

  static _trimSentence(sentence, shouldRemoveTheWordThe) {
    let newSentence = sentence.trim();
    if (shouldRemoveTheWordThe && newSentence.toLowerCase().indexOf('the ') === 0) {
      newSentence = newSentence.substring(4);
      newSentence = newSentence.trim();
    }
    if (newSentence !== sentence) {
      log.debug(`Sentence trimmed`);
      log.debug(`Old sentence: ${sentence}`);
      log.debug(`New sentence: ${newSentence}`);
    }
    return newSentence;
  }

  _getMatch(sentence, state) {
    log.debug(`Get next match in text: ${sentence}`);
    log.debug(`state: ${state}`);
    let matchResult = null;
    let relevantPhrases = (state === 'pre-object-type')? this._objectTypePhrases.concat(this._preObjectTypePhrases) : this._postObjectTypePhrases;
    relevantPhrases.forEach( p => {
      if (!matchResult) {
        let matches = new RegExp(`^${p.phrase}`, `i`).exec(sentence);
        if (matches && matches.length > 0) {
          log.debug(`Match found for: ${matches[0]}`);
          let matchedStrLength = matches[0].length;
          if (matches.length > 1) {
            matches.shift();
          }
          matchResult = {
            type: p.type,
            value: p.value !== undefined ? p.value : matches.length === 1 ? matches[0] : matches,
            isObjectType: !!p['is-object-type'],
            isObjectRelation: !!p['is-object-relation'],
            matchedStrLength: matchedStrLength
          };
          log.debug(`matchResult: ${JSON.stringify(matchResult, null, 4)}`);
        }
      }
    });
    if (!matchResult) {
      log.error(`No match found for sentence: ${sentence}`);
    }
    return matchResult;
  }

  _modelElmDescription(elmDescStr) {
    let modeledElmDesc = {
      object: {}
    };
    let objectNode = modeledElmDesc.object;
    let state = 'pre-object-type';
    let shouldRemoveTheWordTheIfExists = true;
    let sentence = Parser._trimSentence(elmDescStr, shouldRemoveTheWordTheIfExists);

    while (sentence.length > 0) {
      let matchResult = this._getMatch(sentence, state);
      if (matchResult) {
        if (matchResult.isObjectRelation) {
          objectNode = modeledElmDesc.object;
        }
        if (!objectNode.and) {
          objectNode.and = [];
        }
        objectNode.and.push({});
        let propertyNode = objectNode.and[objectNode.and.length - 1];
        propertyNode.type = matchResult.type;
        propertyNode.value = matchResult.value;
        if (matchResult.isObjectRelation) {
          propertyNode.object = {};
          objectNode = propertyNode.object;
          state = 'object-type';
        }
        state = matchResult.isObjectType || state === 'post-object-type' ? 'post-object-type' : 'pre-object-type';
        sentence = sentence.substring(matchResult.matchedStrLength);
        shouldRemoveTheWordTheIfExists = matchResult.isObjectRelation;
        sentence = Parser._trimSentence(sentence, shouldRemoveTheWordTheIfExists);
      } else {
        sentence = '';
      }
    }

    return modeledElmDesc;
  };

  parse(elmDescStr) {
    log.debug('Parser.parse() - start');
    log.debug(`elmDescStr: ${elmDescStr}`);
    let modeledElmDesc = this._modelElmDescription(elmDescStr);
    log.debug(`modeledElmDesc: ${JSON.stringify(modeledElmDesc, null, 4)}`);
    log.debug('Parser.parse() - end');
    return modeledElmDesc;
  }

}
