const path = require("path");
const fs = require("fs");
const packageJson = require(path.resolve("package.json"));
// console.log("packageJson", packageJson);

const { devDependencies } = packageJson;

// define the path to the prettier/eslint config files
const PRETTIER_CONFIG_PATH = path.resolve(".prettierrc");
const ESLINT_CONFIG_PATH = path.resolve(".eslintrc.json");

// check if a prettier config exists
const PRETTIER_CONFIG_EXISTS = fs.existsSync(PRETTIER_CONFIG_PATH);

// check if the prettier package is installed
const PRETTIER_INSTALLED =
  Object.keys(devDependencies).find(
    (packageName) => packageName === "prettier"
  ) && fs.existsSync(path.resolve(".prettierrc"));

// check if an eslint config exists
const ESLINT_CONFIG_EXISTS = fs.existsSync(ESLINT_CONFIG_PATH);
const ESLINT_PLUGIN_PRETTIER_INSTALLED = Object.keys(devDependencies).find(
  (packageName) => packageName === "eslint-plugin-prettier"
);

const PRETTIER_ENABLED = PRETTIER_INSTALLED && PRETTIER_CONFIG_EXISTS;
const ESLINT_PLUGIN_PRETTIER_ENABLED =
  PRETTIER_ENABLED && ESLINT_CONFIG_EXISTS && ESLINT_PLUGIN_PRETTIER_INSTALLED;

// flag to run eslint --fix on the generated code requires proper setup
const LINT_LOCALE_FILES =
  ESLINT_PLUGIN_PRETTIER_ENABLED && ESLINT_CONFIG_EXISTS;

// flag to run prettier --w on the generated code requires proper setup
const MAKE_PRETTIER_LOCALE_FILES = PRETTIER_ENABLED;

// compilation of locale files; experimental feature!
const COMPILE_LOCALES = true;

// enabling this flag will add intl metadata for language/region/(ltr/rtl), but you're not missing much; don't touch!
const APPLY_INTL_METADATA = true;

const PUBLIC_FILES_DIR = path.resolve("public/static");
const SRC_FILES_DIR = path.resolve("src");
const SRC_CONFIG_INTL_DIR = path.join(SRC_FILES_DIR, "config/intl");
const LOCALE_JSON_DIR = path.join(PUBLIC_FILES_DIR, "locale");
const LOCALE_JSON_DEST_DIR = LOCALE_JSON_DIR;

const LOCALE_JSON_SOURCE_DEFAULT_DIR = path.join(LOCALE_JSON_DIR, "source");

// uncomment to compile json inline (aka overwrite existing files) or change the path to the source locale JSON files
const LOCALE_JSON_SOURCE_OVERRIDE_DIR = LOCALE_JSON_DIR;

const LOCALE_JSON_SOURCE_DIR = COMPILE_LOCALES ? (LOCALE_JSON_SOURCE_OVERRIDE_DIR ? LOCALE_JSON_SOURCE_OVERRIDE_DIR : LOCALE_JSON_SOURCE_DEFAULT_DIR) : LOCALE_JSON_DEST_DIR;

const MARKETS_JSON_DIR = path.resolve(`${LOCALE_JSON_SOURCE_DIR}/markets`);

const FALLBACK_LOCALE = 'en-US';

const TESTING_LANGS = ['xx', 'yy'];
const TESTING_REGIONS = ['XX', 'YY'];
const TESTING_LOCALES = TESTING_LANGS.map((lang) => {
  return TESTING_REGIONS.map((region) => {
    return `${lang}-${region}`
  })
})
.flat()
// TODO: clean-up this pigsty
.filter((l) => l !== 'xx-YY'); // 👈 That'll Do Pig, That'll Do

module.exports = {
  PRETTIER_CONFIG_PATH,
  PRETTIER_CONFIG_EXISTS,
  PRETTIER_INSTALLED,
  ESLINT_PLUGIN_PRETTIER_INSTALLED,
  ESLINT_CONFIG_EXISTS,
  ESLINT_CONFIG_PATH,
  COMPILE_LOCALES,
  APPLY_INTL_METADATA,
  LINT_LOCALE_FILES,
  MAKE_PRETTIER_LOCALE_FILES,
  PUBLIC_FILES_DIR,
  SRC_FILES_DIR,
  SRC_CONFIG_INTL_DIR,
  LOCALE_JSON_DIR,
  LOCALE_JSON_SOURCE_DIR,
  LOCALE_JSON_DEST_DIR,
  MARKETS_JSON_DIR,
  FALLBACK_LOCALE,
  TESTING_LANGS,
  TESTING_REGIONS,
  TESTING_LOCALES
};
