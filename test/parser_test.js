import {Parser} from '../src/parser/artemis-parser.js'

describe("Parse Test", () => {
    "use strict";
    let toJSON=function(json){
       return JSON.stringify(json, null, ' ');
    }
    let parser = new Parser();
    it("button should output value:'button'", () => {
        let output = parser.parse('button');
        let json = toJSON([{          
            type:"elm-type",
            value:"button"
        }]);
        expect(output).toEqual(json);
    });
    it("small button should output value:'button' , value 'small'", () => {
        let output = parser.parse('small button');
        let json = toJSON([{
                  
            type:"elm-size",
            value:"small"
        },{          
            type:"elm-type",
            value:"button"
        }]);
        expect(output).toEqual(json);
    });    
});