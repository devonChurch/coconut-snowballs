// const { promisify } = require("util");
// const fs = require("fs");
// const readFileAsync = promisify(fs.readFile);

// module.exports = async dir => {
//   const binary = await readFileAsync(dir, "utf8");

//   return binary.toString();
// };

module.exports = class ReadMarkdownContent {
  constructor({ readFileAsync, logger }) {
    this.readFileAsync = readFileAsync;
    this.logger = logger;
  }

  getContent = markdownFile => this.readFileAsync(markdownFile, 'utf8');

  validateContent = () => this.logger.ready('got markdown data');

  init = async markdownFile => {
    const contentBinary = await this.getContent(markdownFile);
    this.validateContent();
    return contentBinary.toString();
  };
};
