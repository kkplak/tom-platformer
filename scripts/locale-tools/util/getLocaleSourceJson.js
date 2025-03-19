const { LOCALE_JSON_SOURCE_DIR } = require('../constants');
const getJson = require('./getJson');
const path = require('path');

function getLocaleSourceJson(localeId) {
  return getJson(path.resolve(`${LOCALE_JSON_SOURCE_DIR}/${localeId}.json`));
}

module.exports = getLocaleSourceJson;
