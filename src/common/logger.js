export default class Logger {

  constructor(settings) {
    this._logLevelNames = ['ALL', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'OFF'];
    this.setLogLevel('WARN');
    if (settings && settings['log-level']) {
      this.setLogLevel(settings['log-level']);
    }
  }

  setLogLevel(levelName) {
    if (levelName && (this._logLevelNames.indexOf(levelName) != -1)) {
      this._logLevel = this._logLevelNames.indexOf(levelName);
    }
  }

  _log(msg, levelName) {
    if (this._logLevel <= this._logLevelNames.indexOf(levelName)) {
      console.log('ARTEMIS[' + levelName + '] ' + msg);
    }
  }

  trace(msg) {
    this._log(msg, 'ALL');
  };

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
