const constants = require('../constants');

async function formatData(data) {
  if (!constants.MAKE_PRETTIER_LOCALE_FILES) return Promise.resolve(data);
  const prettier = require('prettier/standalone');
  const prettierConfig = require(constants.PRETTIER_CONFIG_PATH);
  console.log('prettier', prettier);
  return await prettier.format(data, prettierConfig);
}

module.exports = formatData;
