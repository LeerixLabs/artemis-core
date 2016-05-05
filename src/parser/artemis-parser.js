import {log} from '../common/logger';

export class Parser {

  constructor(settings) {
    this._settings = settings;

    //placing '^' at  the begining of eachn regex
    this.phrases = this._settings.phrases.map(p=>{ p.phrase   = '^'+p.phrase; return p;  });
    this.output = [];
  }
  isOneOfElements(phrase){
    return phrase.location === "target-type";
  }
  isRelation(phrase){
    return phrase.type === "rel-position";
  }
  processPhrase(phrase){
    let result =true;
    let obj = {value: new RegExp(phrase.phrase).exec(this.words)[0], type: phrase.type};

    if(this.isRelation(phrase)){
      obj.value = '-'+obj.value.replace(/\s/g,'-');
    }

    if(phrase.type==='free-text'){//replace quotes
      obj.value = obj.value.replace(/'|"/g,'');
    }

    if(phrase.type==='html-tag'){//replace quotes
      obj.value = obj.value.replace(/with tag\s+/g,'');
    }

    if(phrase.type==='html-attr-name'){
      let found = this.words;
      let strAttr = found.match(/(?:with attribute\s+)([^']*)/i);
      let attrVal = strAttr[1].indexOf("=");
      let firestParam = strAttr[1].split(" ")[0];

      if(firestParam!=="value" && attrVal==-1){
        let attr = found.replace(/with attribute\s+/g,'');
        obj.value = attr.split(" ")[0];
      }else{
        result = false;
      }
    }
    if(phrase.type==='html-attr-val'){
      obj.value = obj.value.replace(/with attribute value\s+/g,'');
    }

    if(phrase.type==='html-attr-name-and-val'){
      let found = this.words;
      let strAttr = found.match(/(?:with attribute\s+)([^']*)/i);
      let attrVal = strAttr[1].indexOf("=");

      if(attrVal>-1){
        let val=strAttr[1].split("=");
        obj.value = [];
        obj.value.push(val[0]);
        obj.value.push(val[1].split(" ")[0]);
      }else{
        result = false;
      }
    }

    if(result){
      let found = new RegExp(phrase.phrase).exec(this.words)[0];
      this.words = this.words.replace(found, '');
      this.words = this.words.replace(/^\s+/,'');
      this.output.push(obj);
    }
    return result;
  }

  searchForPhrases(){
    let found = false;
    this.phrases.forEach(phrase => {
      if( new RegExp(phrase.phrase).test(this.words) && !found){
        found = this.processPhrase(phrase);
      }
    });
    if(!found){
      this.words= this.words.replace(/^.*/,'');
    }
    return found;
  }

  parse(query) {
    log.debug(`query:${query}`);
    this.words = query;
    this.output = [];

    while(this.words.length && this.searchForPhrases()){}

    let modeledQuery = this.output;
    log.debug('modeledQuery: ' + JSON.stringify(modeledQuery, null, 4));
    return modeledQuery;
  }
}
