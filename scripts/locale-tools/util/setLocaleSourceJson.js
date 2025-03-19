const { LOCALE_JSON_SOURCE_DIR } = require('../constants');
const setJson = require('./setJson');
const path = require('path');

function setLocaleSourceJson(localeId, data) {
  return setJson(path.resolve(`${LOCALE_JSON_SOURCE_DIR}/${localeId}.json`), data);
}

module.exports = setLocaleSourceJson;
