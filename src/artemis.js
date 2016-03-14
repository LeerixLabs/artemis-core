"use strict";
import "babel-polyfill";// must be first
import {Parser} from './artemis-parser';
import {Modeler} from './artemis-modeler.js';

/**
 * Execute artemis query returning a list of element with rank
 * @param query
 */
export function find(query){
    let parser = new Parser();
    let modeler = new Modeler();

    let ast = parser.parse(query);
    let model = modeler.model(ast);
}
