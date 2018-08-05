const consola = require('consola').default;
const jscodeshift = require('jscodeshift');
const AWS = require('aws-sdk');
//
AWS.config.region = 'us-east-1';
//
const logger = consola.withScope('translation');
const awsTranslate = new AWS.Translate({ apiVersion: '2017-07-01' });
//
const ParseJsonData = require('./parse-json-data');
const MakeTranslation = require('./make-translation');
//
const parseJsonData = new ParseJsonData({ jscodeshift, logger });
const makeTranslation = new MakeTranslation({ awsTranslate, logger });
//
module.exports = async ({ json, language }) => {
  let response = {};
  try {
    logger.start('starting json translation sequence');
    logger.info('language', language);
    logger.info('json', json);

    // Convert `json` data into an `async` function.
    const english = parseJsonData.init(json);

    // Translate from english into supplied language.
    const { translations } = await makeTranslation.init({ languages: [language], english });

    response = translations;

    // prettier-ignore
    logger.success(`translated (en) ${json} into (${language}) ${JSON.stringify(translations[language], null, 2)}`);
  } catch (error) {
    logger.fatal(JSON.stringify(error, null, 2));
  }
  return response;
};
