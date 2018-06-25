const { promisify } = require("util");
const glob = require("glob");
const globAsync = promisify(glob);

module.exports = dir => globAsync(`${dir}/**/*.md`, null);
