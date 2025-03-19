async function lintFiles(patterns) {
  const { ESLint } = require('eslint');
  const eslint = new ESLint({ useEslintrc: true, fix: true });
  console.log('Running eslint: ', eslint);
  const results = await eslint.lintFiles(patterns);
  // Apply automatic fixes and output fixed code
  return await ESLint.outputFixes(results);
}

module.exports = lintFiles;
