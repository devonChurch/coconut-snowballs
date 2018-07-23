module.exports = class ExtractMarkdownExamples {
  constructor({ logger }) {
    this.logger = logger;
  }

  getExamples = markdownContent => {
    const matches = markdownContent.match(/(```)(.|\n)*?(```)/g);

    return (matches || []).map(match =>
      match
        .split('\n')
        .filter(line => !/```/.test(line))
        .join('\n')
    );
  };

  validateExamples = markdownExamples =>
    markdownExamples.length
      ? this.logger.info(`found ${markdownExamples.length} markdown examples`)
      : this.logger.warn('no code examples found');

  init = markdownContent => {
    const markdownExamples = this.getExamples(markdownContent);
    this.validateExamples(markdownExamples);
    return markdownExamples;
  };
};
