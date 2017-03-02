class Storage {

	constructor() {
	}

	load() {
		let si = localStorage.getItem('artemisCore');
		if (si) {
			return JSON.parse(si);
		} else {
			return {
				'commands': []
			};
		}
	}

	save(si) {
		localStorage.setItem('artemisCore', JSON.stringify(si));
	}

	clear() {
		if (this.hasItems()) {
			let storageItem = this.load();
			storageItem.commands = [];
			this.save(storageItem);
		}
	}

	append(msg) {
		let storageItem = this.load();
		msg.time = (new Date().getTime());
		storageItem.commands.push(msg);
		this.save(storageItem);
	}

	hasItems() {
		let storageItem = this.load();
		return storageItem.commands.length > 0;
	}

	removeOldItems() {
		let currentTime = (new Date()).getTime();
		let storageItem = this.load();
		storageItem.commands = storageItem.commands.filter(function (cmd) {
			return cmd.time + 300000 <= currentTime;
		});
		this.save(storageItem);
	}

	extractNextItem() {
		let cmd = null;
		let storageItem = this.load();
		if (storageItem.commands.length > 0) {
			cmd = storageItem.commands.splice(0, 1)[0];
			this.save(storageItem);
		}
		return cmd;
	}
}

module.exports.storage = new Storage();