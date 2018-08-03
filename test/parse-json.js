const consola = require('consola');
const jscodeshift = require('jscodeshift');
const AWS = require('aws-sdk');
//
AWS.config.region = 'us-east-1';

console.log('consola', consola);

const logger = consola.withScope('translation');
const awsTranslate = new AWS.Translate({ apiVersion: '2017-07-01' });

const ParseJsonData = require('../parse-json-data');
const MakeTranslation = require('../make-translation');

const parseJsonData = new ParseJsonData({ jscodeshift, logger });
const makeTranslation = new MakeTranslation({ awsTranslate, logger });

const languages = ['de', 'fr'];
const testData = JSON.stringify(
  {
    apple: 'Apple',
    banana: ['Yellow', 'Fruit'],
    tomato: {
      color: 'Red',
      shape: 'Circle',
    },
  },
  null,
  2
);

(async () => {
  try {
    logger.start('starting translation sequence');

    const english = parseJsonData.init(testData);
    const translation = makeTranslation.init({ languages, english });

    logger.success(`translated ${testData} into ${JSON.stringify(translation, null, 2)}`);
  } catch (error) {
    logger.fatal(JSON.stringify(error, null, 2));
  }
})();
