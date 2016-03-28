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
              json.push({
               'type':res.type,
               'value':text.match(new RegExp(res.phrase))[0]
              })
           });
       }else{
         json = null;  
       }
       return json;
       
    }

}



