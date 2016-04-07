import {Manager} from './manager/artemis-manager';
import {ChromeListener} from './listeners/chrome-listener';

let manager = new Manager(window, document);

manager.registerGlobalFunctions();

ChromeListener.registerChromeListener();

exports.artemis = manager;
