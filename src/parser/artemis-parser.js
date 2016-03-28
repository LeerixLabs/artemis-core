import {settings} from './../settings';
export class Parser {
    constructor(){        
    }
    parse(text) {
       let json;
       let results = settings.phrases.filter(currentPrase => {         
         return new RegExp(currentPrase.phrase).test(text);                        
       })
       if(results.length){
           json = {
             'type':results[0].type,
             'value':text.match(new RegExp(results[0].phrase))[0]
           };
       }else{
         return null;  
       }
       
    }

}



