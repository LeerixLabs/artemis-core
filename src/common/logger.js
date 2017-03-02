class Logger {

	constructor() {
		this._logLevelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'OFF'];
		this.setLogLevel('WARN');
	}

	setLogLevel(levelName) {
		if (levelName && (this._logLevelNames.indexOf(levelName) !== -1)) {
			this._logLevel = this._logLevelNames.indexOf(levelName);
		}
	}

	_log(msg, levelName) {
		if (this._logLevel <= this._logLevelNames.indexOf(levelName)) {
			console.log('|ARTEMIS|' + levelName + '| ' + msg);
		}
	}

	isDebug() {
		return this._logLevel === this._logLevelNames.indexOf('DEBUG');
	}

	debug(msg) {
		this._log(msg, 'DEBUG');
	};

	info(msg) {
		this._log(msg, 'INFO');
	};

	warn(msg) {
		this._log(msg, 'WARN');
	};

	error(msg) {
		this._log(msg, 'ERROR');
	};

	fatal(msg) {
		this._log(msg, 'FATAL');
	};

}

module.exports.log = new Logger();
