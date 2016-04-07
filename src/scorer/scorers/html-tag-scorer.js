export default class HtmlTagScorer {

  score(param, elm){
    if (param === "element"){
        return 1;
    } else {
        return param.toLowerCase() === elm.domElm.tagName.toLowerCase() ? 1 : 0;
    }
  }

}
