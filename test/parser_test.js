import {settings} from '../src/settings';
import {Parser} from '../src/parser/artemis-parser.js'



describe("Parse Test", () => {
    let textParser = new Parser(settings);
     
    "use strict";
    it("'button' should be converted to [-button]", () => {
         let words = textParser.parse("button");
         expect(words).toEqual([{value:'button', type:'elm-type'}]);
    }); 
    it("'small button' should be converted to ['-small','-button']", () => {
         let words = textParser.parse("small button");
         expect(words).toEqual([{value:'small'},{value:'button', type:'elm-type'}]);
    });
    it("'button left of button' should be converted to [ '-button', '-left-of', '-button' ]", () => {
         let words = textParser.parse("button left of button");
         expect(words).toEqual([ {value:'button', type:'elm-type'}, {value:'-left-of'}, {value:'button', type:'elm-type'} ]);
    });
    it("correct parsing of parenthesis", () => {
         let words = textParser.parse("\"save all\" button");
         expect(words).toEqual([ {value:'save all'} ,{value:'button', type:'elm-type'}]);
    });             
});