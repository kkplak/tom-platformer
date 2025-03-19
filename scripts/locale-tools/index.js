#!/usr/bin/env node
const { program, Command } = require('commander');
const translateAction = require('./commands/translate');
const translateKeyAction = require('./commands/translate-key');
program.name('locale-tools');

// program
//   .command('translate-key')
//   .description('Add a single key for all locales with Google Translate API')
//   .argument('<key>', 'The key needing translation');

// const translateCmd = program.command('translate', {
//   '--from': {
//     name: '--from',
//     description: 'localeID to use as the base for translation',
//     default: 'en',
//   },
// });
// translateCmd.description(
//   'CLI to do rough translations with Google Translate API'
// );
// translateCmd.addArgument('<dest>');

const translateCmd = new Command('translate');
translateCmd
  .description('CLI to do rough translations with Google Translate API')
  .action(translateAction)
  .argument('<source>', 'localeID to be translated')
  .option('--from <dest>', 'localeID to use as the base for translation', 'en');

const translateKeyCmd = new Command('translate-key');
translateKeyCmd
  .description('CLI to translate a single key with Google Translate API')
  .action(translateKeyAction)
  .argument('<source>', 'localeID to be translated')
  .argument('<localeKey>', 'locale key to be translated')
  .option('--from <dest>', 'localeID to use as the base for translation', 'en');

program.addCommand(translateCmd);
program.addCommand(translateKeyCmd);
program.parseAsync();
