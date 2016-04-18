import constants from './parser-constants';
import {Helper} from './../common/common-helper';

export class Parser {

  constructor(settings) {
    this._settings = settings;
    //placing '^' at  the begining of eachn regex
    this.phrases = this._settings.phrases.map(p=>{ p.phrase   = '^'+p.phrase; return p;  });
    this.output = [];
  }
  isOneOfElements(term){
    return new RegExp(this._settings.phrases.find(p => p.location === "target-type").phrase).test(term);
  }
  isRelation(word){
      return new RegExp(this._settings.phrases.find(p => p.type === "rel-position").phrase).test(word.replace('-',' '));
  }
  processPhrase(phrase){
 
    let found = new RegExp(phrase.phrase).exec(this.words)[0];
    
    this.words = this.words.replace(found, '');
    this.words = this.words.replace(/^\s+/,'');
    
    let obj = {value:found};
    if(this.isOneOfElements(found)){
        obj.type= 'elm-type';
    }
    if(this.isRelation(found)){
        obj.value = '-'+obj.value.replace(/\s/g,'-')
    }
    
    if(phrase.type==='free-text'){//replace quotes
       obj.value = obj.value.replace(/'|"/g,'');
    }
    
    this.output.push(obj);
    return true;
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

  parse(text) {
    this.words = text;
    this.output = [];
    
    while(this.words.length && this.searchForPhrases()){}   
    

    return this.output;
  }
}
