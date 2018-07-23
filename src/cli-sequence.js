// (async () => {
//   console.log('Hello world');
// })();

// const args = require('args');
// const { promisify } = require('util');
// const path = require('path');
// const fs = require('fs-extra');
// const { emptyDir: emptyDirAsync } = fs;
// const readFileAsync = promisify(fs.readFile);
// const readdirAsync = promisify(fs.readdir);
// const writeFileAsync = promisify(fs.writeFile);
// const logger = require('consola').withScope('translation');

// const translate = new AWS.Translate({ apiVersion: "2017-07-01" });

const args = require('args');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs-extra');
const consola = require('consola').default;
const glob = require('glob');
const jscodeshift = require('jscodeshift');
const AWS = require('aws-sdk');
//
AWS.config.region = 'us-east-1';
//
const { argv, cwd } = process;
const { emptyDir: emptyDirAsync, readFile, readdir, writeFile } = fs;
const curentDir = cwd();
const globAsync = promisify(glob);
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const logger = consola.withScope('translation');
const awsTranslate = new AWS.Translate({ apiVersion: '2017-07-01' });
//
const GetCliParams = require('./get-cli-params');
const PrepareDirectories = require('./prepare-directories');
const FindMarkdownFiles = require('./find-markdown-files');
const ReadMarkdownContent = require('./read-markdown-content');
const ExtractMarkdownExamples = require('./extract-markdown-examples');
const ParseExampleAttributes = require('./parse-example-attributes');
const MakeTranslation = require('./make-translation');
const SaveTranslation = require('./save-translation');
// const newLine = () => console.log('\n');

// logger.fatal("this is a fatal message");
// logger.error("this is a error message");
// logger.warn("this is a warn message");
// logger.log("this is a log message");
// logger.info("this is a info message");
// logger.start("this is a start message");
// logger.success("this is a success message");
// logger.ready("this is a ready message");
// logger.debug("this is a debug message");
// logger.trace("this is a trace message");

const getCliParams = new GetCliParams({ args, argv, logger });
const prepareDirectories = new PrepareDirectories({ path, curentDir, emptyDirAsync, logger });
const findMarkdownFiles = new FindMarkdownFiles({ globAsync, logger });
const readMarkdownContent = new ReadMarkdownContent({ readFileAsync, logger });
const extractMarkdownExamples = new ExtractMarkdownExamples({ logger });
const parseExampleAttributes = new ParseExampleAttributes({ jscodeshift, logger });
const makeTranslation = new MakeTranslation({ awsTranslate, logger });
const saveTranslation = new SaveTranslation({ writeFileAsync, logger });

(async () => {
  try {
    logger.start('starting translation sequence');

    //
    //
    const cliFlags = getCliParams.init();

    //
    //
    const { markdownDir, translationsDir } = await prepareDirectories.init(cliFlags);

    //
    //
    const markdownFiles = await findMarkdownFiles.init(markdownDir);

    //
    //
    const markdownContents = await Promise.all(
      markdownFiles.map(markdownFile => readMarkdownContent.init(markdownFile))
    );

    //
    //
    const markdownExamples = await Promise.all(
      markdownContents.map(markdownContent => extractMarkdownExamples.init(markdownContent))
    );

    //
    //
    const exampleAttributes = markdownExamples
      .reduce((acc, examples) => [...acc, ...examples], [])
      .map(markdownExample => parseExampleAttributes.init(markdownExample))
      .filter(attributes => attributes);

    //
    //
    const translations = await Promise.all(
      exampleAttributes.map(example => makeTranslation.init(example))
    );

    //
    //
    const savedFiles = await Promise.all(
      translations.map(translation => saveTranslation.init({ ...translation, translationsDir }))
    );

    //
    //
    const totalSaves = savedFiles.length;
    logger.success(`saved ${totalSaves} files${totalSaves === 1 ? '' : 's'}`);
  } catch (error) {
    logger.fatal(JSON.stringify(error, null, 2));
  }
})();
