import {Parser} from '../src/parser/artemis-parser.js'



describe("Parse Test", () => {
    let textParser = new Parser({});
     
    "use strict";
    it("'button' should be converted to [-button]", () => {
         let words = textParser.parse("button");
        expect(words).toEqual(['-button']);
    }); 
    it("'small button' should be converted to ['-small','-button']", () => {
         let words = textParser.parse("small button");
        expect(words).toEqual(['-small','-button']);
    });
    it("'button left of button' should be converted to [ '-button', '-left-of', '-button' ]", () => {
         let words = textParser.parse("button left of button");
        expect(words).toEqual([ '-button', '-left-of', '-button' ]);
    });          
});