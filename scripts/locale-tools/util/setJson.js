const fs = require('fs');
const { formatData } = require('./formatData');
const constants = require('../constants');
console.log('constants', constants);
function setJson(filename, data, options) {
  const defaultOptions = { format: constants.MAKE_PRETTIER_LOCALE_FILES };
  options = options ?? {};
  options = { ...defaultOptions, ...options };
  const str = JSON.stringify(data, null, 2);
  if (options.format) {
    // console.log('formatting json data', str);
    formatData(str).then((res) => fs.writeFileSync(filename, res));
  } else {
    fs.writeFileSync(filename, str);
  }
}

module.exports = setJson;
