const { promisify } = require("util");
const fs = require("fs");
const readFileAsync = promisify(fs.readFile);

module.exports = async dir => {
  const binary = await readFileAsync(dir, "utf8");

  return binary.toString();
};
