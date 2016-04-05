import "babel-polyfill";// must be first
import {Parser} from './parser/artemis-parser';
import {Planner} from './planner/artemis-planner.js';

/**
 * Execute artemis query returning a list of element with rank
 * @param query
 */
export function find(query){
    let parser = new Parser();
    let planner = new Planner();
    let ast = parser.parse(query);
    let model = planner.model(ast);
}
