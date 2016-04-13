import {settings} from '../src/settings';
import {Planner} from '../src/planner/artemis-planner.js'

describe("Planner Test: ", function(){
    "use strict";
 
     let planner = new Planner(settings);

    it("plan must have property 'target'", function(){
         let parserOutput = [{value:"element"},{value:"left-of"},{value:"Button 2"}];
         let plan = planner.plan(parserOutput);
         expect(plan.target).toBeDefined();
    });

});
