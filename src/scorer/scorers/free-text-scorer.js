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
        for (let a = 0; a < elm.attributes.length; a++) {
            checkedValuesArray.push(elm.attributes[a].name);
            checkedValuesArray.push(elm.attributes[a].value);
        }
        return ScorerHelper.multiStringMatchScore(checkedValuesArray, val, true);
    }
}
