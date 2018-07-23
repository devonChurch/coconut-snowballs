module.exports = class ParseExampleAttributes {
  constructor({ jscodeshift, logger }) {
    this.jscodeshift = jscodeshift;
    this.logger = logger;
  }

  parseId = path => path.value.value.value;

  parseLanguage = path => path.value.value.expression.elements.map(({ value }) => value);

  parseEnglish = path => {
    const createAwaitFunction = path =>
      this.jscodeshift(path).replaceWith(
        this.jscodeshift.awaitExpression(
          this.jscodeshift.callExpression(this.jscodeshift.identifier('translate'), [
            this.jscodeshift.literal(path.value.value),
          ])
        )
      );

    const expression = this.jscodeshift(path.value.value.expression)
      .find(this.jscodeshift.Literal)
      .forEach(createAwaitFunction)
      .toSource();

    return eval(`async translate => (${expression});`);
  };

  parseAttributes = markdownExample => {
    let id, languages, english;

    this.jscodeshift(markdownExample)
      .findJSXElements('Translate')
      .find(this.jscodeshift.JSXAttribute)
      .forEach(path => {
        const { name } = path.value.name;

        if (name === 'id') id = this.parseId(path);
        if (name === 'languages') languages = this.parseLanguage(path);
        if (name === 'english') english = this.parseEnglish(path);
      });

    return { id, languages, english };
  };

  validateAttributes = ({ id, languages, english }) => {
    const isValid = id && languages && english;
    const isAllInvalid = !id && !languages && !english;

    if (isAllInvalid) this.logger.warn('no translation sequence extracted');
    else if (!isValid && !id) this.logger.error('could not extract id prop');
    else if (!isValid && !languages) this.logger.error('could not extract languages prop');
    else if (!isValid && !english) this.logger.error('could not extract english prop');

    return isValid;
  };

  init = markdownExample => {
    const attributes = this.parseAttributes(markdownExample);
    const isValid = this.validateAttributes(attributes);
    return isValid ? attributes : null;
  };
};
