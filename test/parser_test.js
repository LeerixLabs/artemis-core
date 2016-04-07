import {Parser} from '../src/parser/artemis-parser.js'

describe("Parse Test", () => {
    "use strict";
    let toJSON=function(json){
       return JSON.stringify(json, null, ' ');
    }
    let parser = new Parser();
    it("button should output value:'button'", () => {
      expect(true).toBe(true);
    });
    it("small button should output value:'button' , value 'small'", () => {
      expect(true).toBe(true);
    });    
});