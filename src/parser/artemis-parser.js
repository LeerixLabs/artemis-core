import {settings} from './../settings';
export class Parser {
    constructor(){        
    }
    parse(text) {
       let results = settings.phrases.filter(currentPrase => {         
         return new RegExp(currentPrase.phrase).test(text);                        
       })
       return {
           'type':results[0].type,
           'value':text.match(new RegExp(results[0].phrase))[0]
       };
    }

}



