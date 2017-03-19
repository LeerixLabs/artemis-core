import {settings} from '../../src/settings';
import {Parser} from '../../src/parser/artemis-parser';
import {Planner} from '../../src/planner/artemis-planner';

describe('Planner Test: ', function(){

     let parser = new Parser(settings);
     let planner = new Planner(settings);

     it('test basic output structure', () => {
          let modeledElmDesc = parser._buildElementDescriptionModel('element');
          let scoringPlan = planner.plan(modeledElmDesc);
          let expectedPlan = {
               object: {
                    scorer: 'htmlTag',
                    value: '*'
               }
          };
          expect(JSON.stringify(scoringPlan, null, 4)).toEqual(JSON.stringify(expectedPlan, null, 4));
     });

     it('test 2 plans', () => {
          let modeledElmDesc = parser._buildElementDescriptionModel('element with class my-class');
          let scoringPlan = planner.plan(modeledElmDesc);
          let expectedPlan = {
               object: {
                    and: [
                         {
                              scorer: 'htmlTag',
                              value: '*'
                         },
                         {
                              scorer: 'cssClass',
                              value: 'my-class'
                         }
                    ]
               }
          };
          expect(JSON.stringify(scoringPlan, null, 4)).toEqual(JSON.stringify(expectedPlan, null, 4));
     });

     it('test relation', () => {
          let modeledElmDesc = parser._buildElementDescriptionModel('element below element');
          let scoringPlan = planner.plan(modeledElmDesc);
          let expectedPlan = {
               object: {
                    and: [
                         {
                              scorer: 'htmlTag',
                              value: '*'
                         },
                         {
                              scorer: 'relPosition',
                              isRelation: true,
                              value: 'below',
                              object : {
                                   scorer: 'htmlTag',
                                   value: '*'
                              }
                         }
                    ]
               }
          };
          expect(JSON.stringify(scoringPlan, null, 4)).toEqual(JSON.stringify(expectedPlan, null, 4));
     });

});
