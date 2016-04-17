import {Manager} from './manager/artemis-manager';

let manager = new Manager(window, document);

manager.registerGlobalFunctions();

exports.artemis = manager;
