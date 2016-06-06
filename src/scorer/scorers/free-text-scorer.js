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
        let checkedValuesArray = [elm.domElm.text, elm.domElm.value, elm.domElm.innerText, elm.domElm.textContent];
        for (let c = 0; c < elm.classList.length; c++) {
            checkedValuesArray.push(elm.classList.item(c));
        }
        return ScorerHelper.multiStringMatchScore(checkedValuesArray, val, true);
    }
}
