

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
 
    let found = new RegExp(phrase.phrase).exec(this.words)[0];
    
    this.words = this.words.replace(found, '');
    this.words = this.words.replace(/^\s+/,'');
    
    let obj = {value: found, type: phrase.type};
   

    if(this.isRelation(phrase)){
        obj.value = '-'+obj.value.replace(/\s/g,'-');
    }
    
    if(phrase.type==='free-text'){//replace quotes
       obj.value = obj.value.replace(/'|"/g,'');
    }
    
    if(phrase.type==='html-tag'){//replace quotes
       obj.value = obj.value.replace(/with tag\s+/g,'');
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
