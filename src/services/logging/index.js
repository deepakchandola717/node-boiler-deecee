/* eslint-disable class-methods-use-this */
const { logg, updateLevel } = require('./winston');

class Loggger {
  debug(logmessage) {
    logg.debug(logmessage);
  }

  info(logmessage) {
    logg.info(logmessage);
  }

  warn(logmessage) {
    logg.warn(logmessage);
  }

  error(logmessage) {
    logg.error(logmessage);
  }

  updateLevel() {
    return updateLevel();
  }
}

const log = new Loggger();
module.exports = log;
