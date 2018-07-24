module.exports = class ParseExampleAttributes {
  constructor({ jscodeshift, logger }) {
    this.jscodeshift = jscodeshift;
    this.logger = logger;
  }

  // `id` = the file name of the cached translated `json` data.
  parseId = path => path.value.value.value;

  // `languages` the languages in which to translate the original "english" data into.
  parseLanguage = path => path.value.value.expression.elements.map(({ value }) => value);

  // `english` the origin string data transformed into an `async` function that
  // takes a "translate" function and returns a translated data set.
  //
  // Before:
  // -------
  // ```
  // {{
  //   title: 'Hello',
  //   description: 'World'
  // }}
  // ```
  //
  // After:
  // ------
  // ```
  // async (translate) => ({
  //   title: await translate('Hello'),
  //   description: await translate('World'),
  // });
  // ```
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
