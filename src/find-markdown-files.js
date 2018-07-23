module.exports = class FindMarkdownFiles {
  constructor({ globAsync, logger }) {
    this.globAsync = globAsync;
    this.logger = logger;
  }

  getFiles = markdownDir => this.globAsync(`${markdownDir}/**/*.md`, null);

  validateFiles = markdownFiles => {
    if (!markdownFiles.length) {
      this.logger.warn('no markdown files found');
      throw new Error();
    }
    this.logger.success(`found ${markdownFiles.length} markdown files`);
    markdownFiles.forEach(file => this.logger.info(file));
  };

  init = async markdownDir => {
    const markdownFiles = await this.getFiles(markdownDir);
    this.validateFiles(markdownFiles);
    return markdownFiles.length ? markdownFiles : [];
  };
};
