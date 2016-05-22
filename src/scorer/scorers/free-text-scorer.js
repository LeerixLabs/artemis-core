import {ScorerHelper} from './../scorer-helper';

export default class FreeTextScorer {

    constructor(name, settings){
        this.name = name;
        this._settings = settings;
    }

    score(elm, val){
        if (!val || !elm || !elm.domElm) {
            return 0;
        }
        return ScorerHelper.multiStringMatchScore([elm.domElm.text, elm.domElm.value, elm.domElm.innerText, elm.domElm.textContent], val, true);
    }
}
