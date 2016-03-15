
import {Parser} from '../src/parser/artemis-parser.js'
import {Modeler} from '../src/modeler/artemis-modeler.js'

describe("Modeler Test", function(){
    "use strict";
    let parser = new Parser();
    let modeler = new Modeler();

    it("simple modeler test", function(){
        let ast = parser.parse('1st small green button');
        let model = modeler.model(ast);
        expect(model.attributes.length).toEqual(4);
console.log(" _simple modeler test_ ");

    });

    it("advance modeler test", function(){
        let ast = parser.parse('1st small button above red link ');
        let model = modeler.model(ast);
        expect(model.attributes.length).toEqual(3);
        expect(model.edges.length).toEqual(1);
        expect(model.edges[0].to.attributes.length).toEqual(2);
console.log(" _advance modeler test _ ");
    });
});