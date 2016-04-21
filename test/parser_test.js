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
         expect(words).toEqual([{value:'small'},{value:'button', type:'elm-type'}]);
    });
    it("'button left of button' should be converted to [ {value:'button', type:'elm-type'}, {value:'-left-of', type:'rel-position'}, {value:'button', type:'elm-type'}]", () => {
         let words = textParser.parse("button left of button");
         expect(words).toEqual([ {value:'button', type:'elm-type'}, {value:'-left-of', type:'rel-position'}, {value:'button', type:'elm-type'} ]);
    });
    it("correct parsing of double quotes", () => {
         let words = textParser.parse("\"save all\" button");
         expect(words).toEqual([ {value:'save all'} ,{value:'button', type:'elm-type'}]);
    });  
    it("correct parsing of single quotes", () => {
         let words = textParser.parse("'save all' button");
         expect(words).toEqual([ {value:'save all'} ,{value:'button', type:'elm-type'}]);
    });
    it("correct parsing of hyphen delimited text", () => {
         let words = textParser.parse("save-all button");
         expect(words).toEqual([ {value:'save-all'} ,{value:'button', type:'elm-type'}]);
    }); 
    
    
    it('test all posssible elems - should appear in "value"', () => {
        let allposssible = settings.phrases.find(p => p.location === "target-type").phrase.replace(/\(|\)|\^/g,'').split('|');
        allposssible.forEach(p=>{
            expect(textParser.parse(p)[0].value).toEqual(p);
            
        });
    })
    
                 
});