import {settings} from '../src/settings';
import {Parser} from '../src/parser/artemis-parser.js'



describe("Parse Test", () => {
    let textParser = new Parser(settings);
     
    "use strict";
    it("'button' should be converted to [{value:'button', type:'elm-type'}]", () => {
         let words = textParser.parse("button");
         expect(words).toEqual([{value:'button', type:'elm-type'}]);
    }); 
    it("'small button' should be converted to [{value:'small'},{value:'button', type:'elm-type'}]", () => {
         let words = textParser.parse("small button");
         expect(words).toEqual([{value:'small', type:'elm-size'},{value:'button', type:'elm-type'}]);
    });
    it("'button left of button' should be converted to [ {value:'button', type:'elm-type'}, {value:'-left-of', type:'rel-position'}, {value:'button', type:'elm-type'}]", () => {
         let words = textParser.parse("button left of button");
         expect(words).toEqual([{value:'button', type:'elm-type'}, {value:'-left-of', type:'rel-position'}, {value:'button', type:'elm-type'} ]);
    });
    it("correct parsing of double quotes", () => {
         let words = textParser.parse("\"save all\" button");
         expect(words).toEqual([ {value:'save all', type:'free-text'} ,{value:'button', type:'elm-type'}]);
    });  
    it("correct parsing of single quotes", () => {
         let words = textParser.parse("'save all' button");
         expect(words).toEqual([{value:'save all', type:'free-text'} ,{value:'button', type:'elm-type'}]);
    });
    
    it("correct parsing of hyphen delimited text", () => {
         let words = textParser.parse("save-all button");
         expect(words).toEqual([{value:'save-all', type:'free-text'} ,{value:'button', type:'elm-type'}]);
    }); 
    
    
    it('test all posssible elems - should appear in "value"', () => {
        let allposssible = settings.phrases.find(p => p.location === "target-type").phrase.replace(/\(|\)|\^/g,'').split('|');
        allposssible.forEach(p=>{
            expect(textParser.parse(p)[0].value).toEqual(p);
            
        });
    })
    
    it("correct parsing of 'at the bottom'", () => {
         let words = textParser.parse("button at the bottom");
         expect(words).toEqual([{value:'button', type:'elm-type'},{value:'at the bottom', type:'elm-location'} ,]);
    });  
    
    it("correct parsing of 'with smth hhh=kkk' the phrases", () => { 
         let phrases = [
         'with attribute hhh=kkk'];
         phrases.forEach(p=>{             
             expect(textParser.parse(p)[0].value).toEqual(['hhh','kkk']);
         });
    });
    it("correct parsing of 'with smth hhh' the phrases", () => { 
         let phrases = [     
         'with attribute hhh'];
         phrases.forEach(p=>{             
             expect(textParser.parse(p)[0].value).toEqual('hhh');
         });
    });
    it("correct parsing of ordinal the phrases", () => { 
         let phrases = ['first',
         'second',
         'third',
         '2th',
         'small',
         'red',
         'with text hhh',
         'with identity hhh', 
         'with class hhh',
         'with style kkk',
         'with style hhh=kkk'];
         phrases.forEach(p=>{             
             expect(textParser.parse(p)[0].value).toEqual(p);
         });
    }); 
    
    it("in case of 'with tag' phrase - should return only tag name", () => { 
        expect(textParser.parse('with tag h1')[0].value).toEqual('h1');
    });                
});