module.exports = class FindMarkdownFiles {
  constructor({ globAsync, logger }) {
    this.globAsync = globAsync;
    this.logger = logger;
  }

  getFiles = markdownDir => this.globAsync(`${markdownDir}/**/*.md`, null);

  validateFiles = files => {
    if (!files.length) return this.logger.warn('no markdown files found');
    this.logger.success(`found ${files.length} markdown files`);
    files.forEach(file => this.logger.log(file));
  };

  init = async markdownDir => {
    return await this.getFiles(markdownDir);
  };
};
