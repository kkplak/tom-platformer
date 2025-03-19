const fs = require('fs');

function getJson(filename) {
  const jsonString = fs.readFileSync(filename, {
    encoding: 'utf8',
    flag: 'r',
  });
  return JSON.parse(jsonString);
}

module.exports = getJson;
