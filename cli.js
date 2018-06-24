#!/usr/bin/env node

const { promisify } = require("util");
const path = require("path");
const fs = require("fs");
const readFileAsync = promisify(fs.readFile);
const readdirAsync = promisify(fs.readdir);
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
