import {settings} from '../../src/settings';
import {Parser} from '../../src/parser/artemis-parser.js'

describe("Parser Test", () => {
    let parser = new Parser(settings);
     
    it("'button' should be converted to [{value:'button', type:'elm-type'}]", () => {
         let words = parser.parse("button");
         expect(words).toEqual([{type:'elm-type', value:'button'}]);
    });

    it("'small button' should be converted to [{value:'small'},{value:'button', type:'elm-type'}]", () => {
         let words = parser.parse("small button");
         expect(words).toEqual([{value:'small', type:'elm-size'},{value:'button', type:'elm-type'}]);
    });
    it("'button left of button' should be converted to [ {value:'button', type:'elm-type'}, {value:'-left-of', type:'rel-position'}, {value:'button', type:'elm-type'}]", () => {
         let words = parser.parse("button left of button");
         expect(words).toEqual([{value:'button', type:'elm-type'}, {value:'-left-of', type:'rel-position'}, {value:'button', type:'elm-type'} ]);
    });
    it("correct parsing of double quotes", () => {
         let words = parser.parse("\"save all\" button");
         expect(words).toEqual([ {value:'save all', type:'free-text'} ,{value:'button', type:'elm-type'}]);
    });  
    it("correct parsing of single quotes", () => {
         let words = parser.parse("'save all' button");
         expect(words).toEqual([{value:'save all', type:'free-text'} ,{value:'button', type:'elm-type'}]);
    });
    
    it("correct parsing of hyphen delimited text", () => {
         let words = parser.parse("save-all button");
         expect(words).toEqual([{value:'save-all', type:'free-text'} ,{value:'button', type:'elm-type'}]);
    }); 
    
    
    it('test all posssible elems - should appear in "value"', () => {
        let allposssible = settings.phrases.find(p => p.location === "target-type").phrase.replace(/\(|\)|\^/g,'').split('|');
        allposssible.forEach(p=>{
            expect(parser.parse(p)[0].value).toEqual(p);
            
        });
    })
    
    it("correct parsing of 'at the bottom'", () => {
         let words = parser.parse("button at the bottom");
         expect(words).toEqual([{value:'button', type:'elm-type'},{value:'at the bottom', type:'elm-location'} ,]);
    });  
    
    it("correct parsing of 'with smth hhh=kkk' the phrases", () => { 
         let phrases = [
         'with attribute hhh=kkk'];
         phrases.forEach(p=>{             
             expect(parser.parse(p)[0].value).toEqual(['hhh','kkk']);
         });
    });
    it("correct parsing of 'with smth hhh' the phrases", () => { 
         let phrases = [     
         'with attribute hhh'];
         phrases.forEach(p=>{             
             expect(parser.parse(p)[0].value).toEqual('hhh');
         });
    });
    it("correct parsing of ordinal the phrases", () => { 
      let phrases = [
        '1st',
        'first',
        '2nd',
        'second',
        '3rd',
        'third',
        '4th',
        'small',
        'medium',
        'large',
        'red',
        'green',
        'blue'
      ];
         phrases.forEach(p=>{             
           expect(parser.parse(p)[0].value).toEqual(p);
         });
    }); 
    
    it("in case of 'with tag' phrase - should return only tag name", () => { 
        expect(parser.parse('with tag h1')[0].value).toEqual('h1');
    });                
});
