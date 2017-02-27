import {Manager} from './manager/artemis-manager';

let artemisCore = new Manager(window, document);

let artemisCoreStorageItem = artemisCore._load();
if (artemisCoreStorageItem.commands && artemisCoreStorageItem.commands.length > 1) {
	artemisCore._run();
}

module.exports = artemisCore;
