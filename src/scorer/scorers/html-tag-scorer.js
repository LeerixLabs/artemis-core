export default class ElementTagScorer {

  static score(param,elem){
    if (param === "element"){
        return 1;
    } else {
        return param === elem.tagName ? 1: 0;
    }
  }

}
