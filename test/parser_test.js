import {Parser} from '../src/parser/artemis-parser.js'

describe("Parse Test", function(){
    "use strict";
    let parser = new Parser();
    it("simple query ast", function(){
        var ast = parser.parse('1st small green button');
        expect(ast[0]['type']).toEqual('elm-ordinal');
        expect(ast[0]['value']).toEqual('1');

        expect(ast[1]['type']).toEqual('elm-size');
        expect(ast[1]['value']).toEqual('small');

        expect(ast[2]['type']).toEqual('elm-color');
        expect(ast[2]['value']).toEqual('green');

        expect(ast[3]['type']).toEqual('elm-type');
        expect(ast[3]['value']).toEqual('button');
        
console.log(" _simple query ast_ ");

    });

    it("relation query ast", function(){
        let ast = parser.parse('small button above red button');
        expect(ast[0]['type']).toEqual('elm-size');
        expect(ast[0]['value']).toEqual('small');

        expect(ast[1]['type']).toEqual('elm-type');
        expect(ast[1]['value']).toEqual('button');

        expect(ast[2]['type']).toEqual('rel-location');
        expect(ast[2]['value']).toEqual('above');

        expect(ast[2]['target'][0]['type']).toEqual('elm-color');
        expect(ast[2]['target'][0]['value']).toEqual('red');

        expect(ast[2]['target'][1]['type']).toEqual('elm-type');
        expect(ast[2]['target'][1]['value']).toEqual('button');
        
console.log(" _relation query ast_ ");

    });

    it("bad query", function(){
        let ast = parser.parse("verybadquery");
        
        console.log(" _bad query_ ");
    });


});