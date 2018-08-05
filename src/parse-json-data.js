module.exports = class ParseJsonData {
  constructor({ jscodeshift, logger }) {
    this.jscodeshift = jscodeshift;
    this.logger = logger;
  }

  parseKey = path => {
    path.value.key.type = 'Identifier';
    path.value.key.name = path.value.key.value;
  };

  parseEnglish = path => {
    const { jscodeshift: j } = this;

    j(path).replaceWith(
      j.awaitExpression(j.callExpression(j.identifier('translate'), [j.literal(path.value.value)]))
    );
  };

  // `english` the origin string data transformed into an `async` function that
  // takes a "translate" function and returns a translated data set.
  //
  // Before:
  // -------
  // ```
  // "{
  //   \"title\": \"Hello\",
  //   \"description\": \"World\"
  // }"
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
  parseJson = json => {
    const { jscodeshift: j } = this;
    const asyncWrapper = `async translate => (${json})`;

    // Interestingly because both the json "key" reference is in "quotation" marks
    // its targeted as a "Litteral" and not an "Identifier". Here is where we change
    // that declaration =)
    const parsedKeys = j(asyncWrapper)
      // Find each "key" / "value" pair in the supplied Object.
      .find(j.Property)
      .forEach(this.parseKey)
      .toSource();

    // Now that there is a clear separation between "key" and "value" references
    // (they are not both "Litterals") we can go through and convert the "values"
    // (which are still references as "Litterals") to async functions.
    return (
      j(parsedKeys)
        // Find each "value" pair in the supplied Object.
        .find(j.Literal)
        .forEach(this.parseEnglish)
        .toSource()
    );
  };

  init = json => {
    return eval(this.parseJson(json));
  };
};
