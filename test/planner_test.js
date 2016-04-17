import {settings} from '../src/settings';
import {Planner} from '../src/planner/artemis-planner.js'

describe("Planner Test: ", function(){
    "use strict";
 
     let planner = new Planner(settings);

    it("plan must have property 'target'", function(){
         let parserOutput = [{value:"element", type:'elm-type'},{value:"left-of"},{value:"Button 2"}];
         let plan = planner.plan(parserOutput);
         expect(plan.target).toBeDefined();
    });
  
});
describe("Planner Test: output of 'button':::", function(){
    "use strict";
 
    let planner = new Planner(settings);
    let parserOutput = [{value:"button", type:'elm-type'}];
    let plan = planner.plan(parserOutput);
    let and = plan.target.and;
    let or = and[0].or;
    let firstMemeber = or[0];     
     
     
    it("should have only 1 'and'", function(){        
         expect(and.length).toBe(1);                  
    });
    it("should have 6 members inside 'or'", function(){
        expect(or.length).toBe(6);        
    });       
    it("first member of 'or' shuold be html-element", function(){        
        expect(firstMemeber.scorer).toBe('html-tag');
        expect(firstMemeber.param).toBe('button');        
    }); 
});