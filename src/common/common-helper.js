export default class Helper {

  static toJSON(object) {
    return JSON.stringify(object, null, 4);
  }

}
