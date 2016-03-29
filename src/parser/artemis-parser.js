import {settings} from './../settings';
export class Parser {
    constructor(){        
    }
    parse(text) {
       let json = [];
       let results = settings.phrases.filter(currentPrase => {         
         return new RegExp(currentPrase.phrase).test(text);                        
       })
       if(results.length){
           results.forEach(res => {
              let matches = text.match(new RegExp(res.phrase,'g'));
              matches.forEach(match => {
                json.push({
                'type':res.type,
                'value':match
                });
              });
           });
       }
       return JSON.stringify(json, null, ' ');
       
    }

}



