import Manager from './manager/artemis-manager';
let artemisCore = new Manager(window, document);
artemisCore.onLoad();
module.exports = artemisCore;
