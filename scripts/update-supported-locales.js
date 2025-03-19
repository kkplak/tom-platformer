#!/usr/bin/env node
// @ts-ignore
/* eslint-disable */
require('intl');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { getJson, setJson, lintFiles, getLocaleJson } = require('./locale-tools/util');
const constants = require('./locale-tools/constants');
const languageNames = require('./locale-tools/language-names');

const CWD = process.cwd();
const supportedLocales = new Set([]);
const rollupLocales = new Map([]);
const rollupCompiledLocales = new Map([]);
const localesByRegion = new Map([]);
const regionLocaleLangs = new Map([]);
const localeLangs = new Map([]);
const {
  COMPILE_LOCALES,
  SRC_CONFIG_INTL_DIR,
  LOCALE_JSON_SOURCE_DIR,
  LOCALE_JSON_DEST_DIR,
  LINT_LOCALE_FILES,
  MARKETS_JSON_DIR,
  APPLY_INTL_METADATA,
  TESTING_LANGS,
  TESTING_REGIONS,
  TESTING_LOCALES,
  FALLBACK_LOCALE
} = constants;

const marketLocales = new Map([]);
const config = getJson(path.resolve(`${__dirname}/config.json`));
// console.log(config);

const uniqueMarketCodes = _.chain(Object.values(config.marketCodes))
  .uniq()
  .map(_.toLower)
  .value();
console.log('uniqueMarketCodes', uniqueMarketCodes);

if (!fs.existsSync(MARKETS_JSON_DIR)) {
  console.log('Creating markets dir', MARKETS_JSON_DIR);
  fs.mkdirSync(MARKETS_JSON_DIR);
}

const marketTranslations = new Map([]);

uniqueMarketCodes.forEach((marketCode) => {
  const marketFilename = path.resolve(`${MARKETS_JSON_DIR}/${marketCode}.json`);
  if (!fs.existsSync(marketFilename)) {
    console.log('Creating market file', marketFilename);
    fs.writeFileSync(marketFilename, JSON.stringify({}));
  }
  marketTranslations.set(marketCode, getJson(marketFilename));
});

const languageNamesMap = new Map(Object.entries(languageNames));

function getAppFileName(filename) {
  return filename.replace(`${CWD}/`, './');
}

function getJsonFiles(startPath) {
  const filter = '.json';

  if (!fs.existsSync(startPath)) {
    console.error('no dir ', startPath);
    return [];
  }

  const files = fs.readdirSync(startPath).filter((f) => f.indexOf(filter) >= 0);
  // console.log(files);

  return new Map(
    files.map((file) => {
      const srcFilename = path.join(startPath, file);
      const appFilename = getAppFileName(srcFilename);
      const baseFile = path.basename(srcFilename);

      const destFilename = path.join(LOCALE_JSON_DEST_DIR, baseFile);
      const locale = baseFile.replace(filter, '');
      let info = new Intl.Locale(locale);

      // console.log('srcFilename', srcFilename);

      return [
        locale,
        {
          srcFilename,
          appFilename,
          destFilename,
          baseFile,
          locale,
          language: info?.language,
          region: info?.region,
          script: info?.script,
          collations: info?.collations,
          direction: info.textInfo?.direction,
          supported: locale !== 'global',
          debug: TESTING_LOCALES.find((l) => l === locale) ? true : false,
          extends: locale !== 'global' ? ['global'] : [],
          translations: getJson(srcFilename),
        },
      ];
    })
  );
}

function generateSupportedLocales(jsonFiles) {
  jsonFiles.forEach((obj) => {
    if (obj.supported) {
      supportedLocales.add(obj.locale);
    }
  });
}

function generateRollupLocales(jsonFiles) {
  jsonFiles.forEach((obj) => {
    const { locale } = obj;
    if (!rollupLocales.has(locale) && obj.supported) {
      rollupLocales.set(locale, obj.extends);
    }
    rollupCompiledLocales.set(locale, [locale]);
    const localeParts = locale.split('-');
    while (localeParts.length) {
      const candidate = localeParts.join('-');
      if (supportedLocales.has(candidate)) {
        const newValues = [...rollupLocales.get(locale), candidate];
        // console.log('newValues', newValues);
        newValues.sort((a, b) => {
          const aSegmentCnt = a.split('-').length;
          const bSegmentCnt = b.split('-').length;
          if (a === 'global' || b === 'global') return 0;
          if (aSegmentCnt === 1) return -1;
          return a <= b && aSegmentCnt <= bSegmentCnt ? -1 : 1;
        });
        rollupLocales.set(locale, newValues);
      }
      localeParts.pop();
    }
  });
}

function applyIntlMetadata(jsonFiles) {
  // console.log('Applying Intl Metdata');
  jsonFiles.forEach((obj) => {
    const { locale, srcFilename, translations } = obj;

    if (locale === 'global') return;

    const languageDisplayName = new Intl.DisplayNames([locale], { type: 'language' });
    let newTranslations = _.cloneDeep(Object.assign({ GENERAL: {} }, obj.translations));
    newTranslations.GENERAL.languageName = languageDisplayName.of(new Intl.Locale(locale));

    if (!translations?.GENERAL?.market && config.marketCodes[locale]) {
      newTranslations.GENERAL.market = config.marketCodes[locale].toLowerCase();
    }

    newTranslations.DEBUG = { locale: obj.debug }

    if (!obj.region && obj.language) {
      newTranslations.GENERAL.language = obj.language;
    }

    if (obj.region && obj.language) {
      newTranslations.GENERAL.locale = locale;
    }

    if (obj.region) {
      delete newTranslations.GENERAL.language;
      newTranslations.GENERAL.region = obj.region;
    }

    if (!translations?.GENERAL?.script && obj.script) {
      newTranslations.GENERAL.script = obj.script;
    }

    if (!translations?.GENERAL?.collations && obj.collations) {
      newTranslations.GENERAL.collations = obj.collations;
    }

    if (!translations?.GENERAL?.direction && obj.direction) {
      newTranslations.GENERAL.direction = obj.direction;
    }

    if (!_.isEqual(translations, newTranslations)) {
      // console.log(`Updating locale file with intl metadata ${srcFilename}`, newTranslations);
      setJson(srcFilename, newTranslations);
      jsonFiles.get(locale).translations = newTranslations;
      // console.log(jsonFiles.get(locale));
    }
  });
}

function mergeJson(t1, t2) {
  const translations = { ...t1 };
  const rTranslations = { ...t2 };
  _.defaultsDeep(translations, rTranslations);
  return translations;
}

function generateDestLocales(jsonFiles) {
  rollupLocales.forEach((rollups, locale) => {
    let { translations, destFilename } = jsonFiles.get(locale);
    // console.log('rollups', locale, destFilename, rollups);
    // rollups.reverse().forEach((rLocale) => {
    //   if (locale !== rLocale) {
    //     const rTranslations = jsonFiles.get(rLocale).translations;
    //     translations = mergeJson(translations, rTranslations);
    //   }
    // });

    if (translations.GENERAL.market && translations.GENERAL.locale) {
      _.defaultsDeep(
        translations,
        marketTranslations.get(translations.GENERAL.market)
      );
    }
  
    // console.log(`Writing ${destFilename}`, translations);
    setJson(destFilename, translations);
  });
}

const generateLocalesByRegion = () => {
  const sLocalocales = Array.from(supportedLocales);
  // console.log('sLocalocales', sLocalocales);
  return [...sLocalocales.values()].filter((v) => {
    return v.split("-").length > 1
  }).forEach((v) => {
    const parts = v.split("-");
    if (!localesByRegion.has(parts[1])) {
      localesByRegion.set(parts[1], []);
    }
    localesByRegion.set(parts[1], [...localesByRegion.get(parts[1]), v]);
  }
  )
}

/**
 * Generates a map rollup of all locale and language data grouped by region
 */
function generateAllRegionLocaleLangs() {
  Array.from(localesByRegion)
  // .filter(([region, locales]) => region === currRegion)
  .forEach(([region, locales]) => {
    const languages = locales.map((locale) => {
      const localeObj = new Intl.Locale(locale);
      if(!localeObj.region == region) {
        throw new Error(`Error generating map of languages available. ${region} is not a valid region! Expected ${localeObj.region} for locale (${locale})`);
      }
      return {
        region: localeObj.region,
        lang: localeObj.language,
        targetLang: localeObj.toString().toLocaleLowerCase(),
        locale,
        dir: localeObj.textInfo.direction,
        displayName: languageNamesMap.has(locale) ? languageNamesMap.get(locale) : `${locale} (MISSING LANG NAME)`
      } 
    });
    const obj = {
      region,
      locales,
      langCount: languages.length,
      showLangToggle: languages.length >= 2,
      languages
    }
    regionLocaleLangs.set(region, obj);
  });
  // console.log('generateAllRegionLocaleLangs :: regionLocaleLangs', regionLocaleLangs);
}

/**
 * Generates a map rollup of all locale and language data grouped by LOCALE
 */
function generateLocaleLangs() {
  const sLocalocales = Array.from(supportedLocales);
  return [...sLocalocales.values()].filter((v) => {
    return v.split("-").length > 1
  }).forEach((locale) => {
    const key = locale;
    const [lang, region] = locale.split("-");
    if (!localeLangs.has(key)) {
      localeLangs.set(key, []);
    }
    localeLangs.set(key, [...localeLangs.get(key), regionLocaleLangs.get(region)]);
  })
}

function writeLocaleLangsCSV() {
  const csvWriter = createCsvWriter({
    path: `${constants.PUBLIC_FILES_DIR}/csv/locale-langs.csv`,
    header: [
        {id: 'locale', title: 'LOCALE'},
        {id: 'region', title: 'REGION'},
        {id: 'langCount', title: 'LANG COUNT'},
        {id: 'showLangToggle', title: 'SHOW LANG TOGGLE'},
        {id: 'languages', title: 'LANGUAGES'},
    ]
  });
  
  const records = Array.from(localeLangs).map(([locale, data]) => {
    // console.log(locale, data);
    const metadata = data[0];
    const csvParts = {
      locale,
      region: metadata.region,
      langCount: metadata.langCount,
      showLangToggle: metadata.showLangToggle,
      languages: metadata.languages.map((l) => l.displayName).join('|'),
      // metadata.locales.join('|')
    }
    return csvParts;
  });
  
  csvWriter.writeRecords(records)
    .then(() => {
        console.log('...Done');
    });
}

/**
 * @name bootstrapJsonFiles
 * @description Build script to create testing locale json files for lang settings toggler
 *  - Runs before update supported locales runs:
 *  - Copies ‘en-US.json’ (or ideally a configurable locale to copy) to the following files:
      - xx.json, yy.json
        - If they already exist – overwrite them
      - Create the following files:
        - xx-XX.json, yy-XX.json, yy-YY.json
          - If they already exist – overwrite them
      - Each files should contain the following a single object with one key – debug – inside whose value is true.
      - Debug: The disclaimer page component should be updated to show the locale file name for debugging
 */
function bootstrapJsonFiles(jsonFiles) {
  //
  const fallbackLocaleJson = getLocaleJson(FALLBACK_LOCALE);
  console.log('fallbackLocaleJson', fallbackLocaleJson);
  console.log('TESTING_LOCALES', TESTING_LOCALES);

  const existingJsonFileKeys = Object.keys(Object.fromEntries(jsonFiles));
  console.log('existingJsonFileKeys', existingJsonFileKeys);
  TESTING_LANGS.forEach((lang) => {
    const fileName = `${LOCALE_JSON_SOURCE_DIR}/${lang}.json`;
    console.log(`TESTING_LANGS :: Writing ${fileName}`);
    fs.writeFileSync(fileName, JSON.stringify(fallbackLocaleJson));
  })
  TESTING_LOCALES.forEach((lang) => {
    const fileName = `${LOCALE_JSON_SOURCE_DIR}/${lang}.json`;
    console.log(`TESTING_LOCALES :: Writing ${fileName}`);
    fs.writeFileSync(fileName, JSON.stringify({}));
  })
}

// get the initial jsonFiles for bootstraping
let jsonFiles = getJsonFiles(LOCALE_JSON_SOURCE_DIR);
bootstrapJsonFiles(jsonFiles);

// refetch the JSON files for further processing
jsonFiles = getJsonFiles(LOCALE_JSON_SOURCE_DIR);

generateSupportedLocales(jsonFiles);
generateRollupLocales(jsonFiles);
generateLocalesByRegion(jsonFiles);
if (APPLY_INTL_METADATA) {
  applyIntlMetadata(jsonFiles);
}
if (COMPILE_LOCALES) {
  generateDestLocales(jsonFiles);
}
generateAllRegionLocaleLangs();
generateLocaleLangs();

writeLocaleLangsCSV();

// Object.entries(languageNames).forEach(([locale, langName]) => {
//   // console.log(locale, langName);
//   const languageDisplayNames = new Intl.DisplayNames([locale], { type: 'language' });
//   const properName = languageDisplayNames.of(new Intl.Locale(locale));
//   if(properName !== langName) {
//     console.log(`${locale}|${langName}|${properName}`);
//   }
// });

// console.log('supportedLocales', supportedLocales, supportedLocales.size);
// console.log('rollupLocales', rollupLocales);
// console.log('SRC_CONFIG_INTL_DIR', SRC_CONFIG_INTL_DIR);

fs.writeFileSync(
  path.resolve(`${SRC_CONFIG_INTL_DIR}/supportedLocales.ts`),
  `
export const fallbackLocale = '${FALLBACK_LOCALE}';
export const supportedLocales = new Set(${JSON.stringify(Array.from(supportedLocales), null, 2).replace(/"/g, "'")});
export const rollupLocales = new Map(${JSON.stringify(Array.from(rollupLocales), null, 2).replace(/"/g, "'")});
export const localesByRegion = new Map(${JSON.stringify(Array.from(localesByRegion), null, 2).replace(/"/g, "'")});
export const languageNames = new Map(${JSON.stringify(Object.entries(languageNames), null, 2).replace(/"/g, "'")});
export const regionLocaleLangs = new Map(${JSON.stringify(Array.from(regionLocaleLangs), null, 2).replace(/"/g, "'")});
export const localeLangs = new Map(${JSON.stringify(Array.from(localeLangs), null, 2).replace(/"/g, "'")});
export const marketLocales = new Map(${JSON.stringify(Array.from(marketLocales), null, 0).replace(/"/g, "'")});
`
);

if (LINT_LOCALE_FILES) {
  lintFiles(['./src/config/intl/supportedLocales.ts']);
}
