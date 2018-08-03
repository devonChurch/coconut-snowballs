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
const { emptyDir: emptyDirAsync, readFile, writeFile } = fs;
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
//
const getCliParams = new GetCliParams({ args, argv, logger });
const prepareDirectories = new PrepareDirectories({ path, curentDir, emptyDirAsync, logger });
const findMarkdownFiles = new FindMarkdownFiles({ globAsync, logger });
const readMarkdownContent = new ReadMarkdownContent({ readFileAsync, logger });
const extractMarkdownExamples = new ExtractMarkdownExamples({ logger });
const parseExampleAttributes = new ParseExampleAttributes({ jscodeshift, logger });
const makeTranslation = new MakeTranslation({ awsTranslate, logger });
const saveTranslation = new SaveTranslation({ writeFileAsync, logger });
//
//
//
//
//
//
const ParseJsonData = require('./parse-json-data');
const parseJsonData = new ParseJsonData({ jscodeshift, logger });
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
    logger.start('starting json translation sequence');

    // debugger;
    console.log('english');
    const english = parseJsonData.init(testData);
    console.log(english);
    const translation = await makeTranslation.init({ languages, english });
    console.log(JSON.stringify(translation, null, 2));

    logger.success(`translated ${testData} into ${JSON.stringify(translation, null, 2)}`);
  } catch (error) {
    logger.fatal(JSON.stringify(error, null, 2));
  }
})();
//
//
//
//
//
//
// (async () => {
//   try {
//     logger.start('starting translation sequence');

//     // Extract / validate the user supplied CLI flags for the `/src` and `/dist` directories.
//     const cliFlags = getCliParams.init();

//     // Create absolute paths to the `/src` and `/dist` directories.
//     const { markdownDir, translationsDir } = await prepareDirectories.init(cliFlags);

//     // Generate a "glob" and get references to ALL Markdown (.md) files located
//     // under the `/src` directory.
//     const markdownFiles = await findMarkdownFiles.init(markdownDir);

//     // Convert Markdown file data into usable strings.
//     const markdownContents = await Promise.all(
//       markdownFiles.map(markdownFile => readMarkdownContent.init(markdownFile))
//     );

//     // Extract code example(s) from within each Markdown files data.
//     const markdownExamples = await Promise.all(
//       markdownContents.map(markdownContent => extractMarkdownExamples.init(markdownContent))
//     );

//     // Parse each code example into a set of attributes.
//     const exampleAttributes = markdownExamples
//       .reduce((acc, examples) => [...acc, ...examples], [])
//       .map(markdownExample => parseExampleAttributes.init(markdownExample))
//       .filter(attributes => attributes);

//     // Translate each code example into the supplied language(s)/
//     const translations = await Promise.all(
//       exampleAttributes.map(example => makeTranslation.init(example))
//     );

//     // Save each translated cached data set into the `/src` directory with the `id` as the file name.
//     const savedFiles = await Promise.all(
//       translations.map(translation => saveTranslation.init({ ...translation, translationsDir }))
//     );

//     const totalSaves = savedFiles.length;
//     logger.success(`saved ${totalSaves} files${totalSaves === 1 ? '' : 's'}`);
//   } catch (error) {
//     logger.fatal(JSON.stringify(error, null, 2));
//   }
// })();
