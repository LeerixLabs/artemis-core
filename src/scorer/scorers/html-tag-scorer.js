export default class ElementTagScorer {

  static score(param, elm){
    if (param === "element"){
        return 1;
    } else {
        return param === elm.tagName ? 1: 0;
    }
  }

}
