#!/usr/bin/env node

const args = require("args");
const { promisify } = require("util");
const path = require("path");
const fs = require("fs");
const readFileAsync = promisify(fs.readFile);
const readdirAsync = promisify(fs.readdir);
const writeFileAsync = promisify(fs.writeFile);
const logger = require("consola").withScope("translation");
const findMarkdownFiles = require("./find-markdown-files");
const readMarkdownData = require("./read-markdown-data");
const extractMarkdownExamples = require("./extract-markdown-examples");
const parseExampleAttributes = require("./parse-example-attributes");
const createTranslator = require("./create-translator");
const newLine = () => console.log("\n");

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

logger.start("starting translation sequence");

args
  .option(
    "markdown", //
    "The root directory where your documentation lives"
  )
  .option(
    "styleguidist", //
    "root directory where the generated styleguidist index.html lives"
  );

const { markdown: markdownFlag, styleguidist: styleguidistFlag } = args.parse(
  process.argv
);

!markdownFlag && logger.error("--markdown flag must be supplied");
!styleguidistFlag && logger.error("--styleguidist flag must be supplied");

if (!markdownFlag && !styleguidistFlag) return;

const curentDir = process.cwd();
const markdownDir = path.resolve(curentDir, markdownFlag);
const styleguidistDir = path.resolve(curentDir, styleguidistFlag);

logger.ready("cli parameters are present");
logger.log(`markdown directory = ${markdownDir}`);
logger.log(`styleguidist directory = ${styleguidistDir}`);

(async () => {
  try {
    //
    newLine() || logger.start("find markdown files");
    const markdownFiles = await findMarkdownFiles(markdownDir);
    if (!markdownFiles.length) return logger.warn("no markdown files found");
    logger.success(`found ${markdownFiles.length} markdown files`);
    markdownFiles.forEach(file => logger.log(file));
    //
    for (markdownFile of markdownFiles) {
      //
      newLine() || logger.start(`extract code examples from ${markdownFile}`);
      const markdownData = await readMarkdownData(markdownFile);
      logger.ready("got markdown data");
      const markdownExamples = extractMarkdownExamples(markdownData);
      if (!markdownExamples.length) {
        logger.warn("no code examples found");
        continue;
      }

      logger.info(`found ${markdownExamples.length} markdown examples`);
      //
      for (markdownExample of markdownExamples) {
        //
        const { id, languages, english } = parseExampleAttributes(
          markdownExample
        );
        if (!id && !languages && !english) {
          logger.warn("no translation sequence extracted");
          continue;
        } else if (!id) {
          logger.error("could not extract id prop");
          continue;
        } else if (!languages) {
          logger.error("could not extract languages prop");
          continue;
        } else if (!english) {
          logger.error("could not extract english prop");
          continue;
        }
        let translations = {};
        for (language of languages) {
          const translator = createTranslator(language);
          const translation = await english(translator);
          // console.log(translation);
          translations = {
            ...translations,
            [language]: translation
          };
        }
        console.log(translations);
        await writeFileAsync(
          `${styleguidistDir}${id}.json`,
          JSON.stringify(translations),
          "utf8"
        );
      }
    }
  } catch (error) {
    logger.error(error);
  }
})();

// (() => {
//     console.log("RUNNING!");
// })();

// try {
//   if (!flags.markdown) {
//     throw "--markdown flag must be supplied";
//   }

//   if (!flags.styleguidist) {
//     throw "--styleguidist flag must be supplied";
//   }
// } catch (error) {
//   console.error(error);
// }

/*
const filesDir = path.resolve(curentDir, "files");
const say = message =>
  new Promise(resolve => {
    setTimeout(() => resolve(`completed | ${message}`), Math.random() * 5);
  });

(async () => {
  const files = await readdirAsync(filesDir);

  for (file of files) {
    const foo = require(`${filesDir}/${file}`);
    const message = await foo(say);
    console.log(message);
  }
})();
*/
