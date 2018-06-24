#!/usr/bin/env node

const args = require("args");
const { promisify } = require("util");
const path = require("path");
const fs = require("fs");
const readFileAsync = promisify(fs.readFile);
const readdirAsync = promisify(fs.readdir);
const logger = require("consola").withScope("translation");

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

const flags = args.parse(process.argv);

// console.log("flags", flags);

!flags.markdown && logger.error("--markdown flag must be supplied");
!flags.styleguidist && logger.error("--styleguidist flag must be supplied");

if (!flags.markdown && !flags.styleguidist) return;
logger.ready("cli parameters are present");
logger.log(`--markdown = "${flags.markdown}"`);
logger.log(`--styleguidist = "${flags.styleguidist}"`);

logger.start("find markdown files");

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
const filesDir = path.resolve(__dirname, "files");
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
