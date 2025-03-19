const { LOCALE_JSON_DEST_DIR } = require('../constants');
const getJson = require('./getJson');
const path = require('path');

function getLocaleJson(localeId) {
  return getJson(path.resolve(`${LOCALE_JSON_DEST_DIR}/${localeId}.json`));
}

module.exports = getLocaleJson;
