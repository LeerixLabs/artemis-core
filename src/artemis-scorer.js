import {numeric} from '../src/numeric-1.2.6.js'
class FeatureMap{


    constructor(){
        "use strict";
        this.latest = 0;
        this.map = {};
        this.revmap = {};
    }

    addFeature(k){
        "use strict";
        this.map[k] =  this.latest;
        this.revmap[this.latest] = k;
        this.latest++;
    }

    toInt(k){
        "use strict";
        return this.map[k];
    }

    toKey(i){
        "use strict";
        return this.revmap[i];
    }
}


export class Scorer{

    /**
     * given the model
     *  convert to low level feature
     *  convert feature to vector
     *  rank different element
     *  return top ranking elements
     * @param model
     */
    score(model){
        "use strict";

    }



}