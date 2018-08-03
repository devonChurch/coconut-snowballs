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
    const { jscodeshift: j } = this;
    const createAwaitFunction = path =>
      j(path).replaceWith(
        j.awaitExpression(
          j.callExpression(j.identifier('translate'), [j.literal(path.value.value)])
        )
      );

    const expression = j(path.value.value.expression)
      .find(j.Literal)
      .forEach(createAwaitFunction)
      .toSource();

    return eval(`async translate => (${expression});`);
  };

  parseAttributes = markdownExample => {
    const { jscodeshift: j } = this;
    let id, languages, english;

    j(markdownExample)
      .findJSXElements('Translate')
      .find(j.JSXAttribute)
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

/*
// Press ctrl+space for code completion
export default function transformer(file, api) {
  const j = api.jscodeshift;
  
  // console.log(file.source)
  const tempFileData1 = `
const english = ${JSON.stringify({
  one: '1',
  two: '2',
  three: '3'
})};
	`;
  
  const tempFileData2 = `
const english = {
  one: '1',
  two: '2',
  three: '3'
};
	`;

  console.dir(j)
  console.log(tempFileData1);
  
  return j(tempFileData1)
    .find(j.Property)
    .forEach(path => {
      console.log(path)
        path.value.key.type = 'Identifier';
	    path.value.key.name = path.value.key.value;
        
      // j(path).replaceWith(
        // j.property(
        	// j.identifier('hello'),
            // [j.literal('world')]
        // )
      // );
    })
    .toSource();
}

*/

// -- - - - - - - -

/*
// Press ctrl+space for code completion
export default function transformer(file, api) {
  const j = api.jscodeshift;
  
  // console.log(file.source)
  const tempFileData1 = `
const english = ${JSON.stringify({
  one: '1',
  two: '2',
  'three': ['3', 'three', '3.0.0']
})};
	`;
  
  const tempFileData2 = `
const english = {
  one: '1',
  two: {0: 'apple', 1: 'banana'},
  'three': ['3', 'three', '3.0.0']
};
	`;
  
  const tempFileData3 = `
async () => (${JSON.stringify({
  one: '1',
  two: '2',
  'three': ['3', 'three', '3.0.0']
})});
	`;

  console.dir(j)
  console.log(tempFileData1);
  console.log(j(tempFileData1));
  console.log('object?', 
    j(tempFileData1)
    	.find(j.ObjectExpression).__paths[0]
              // .toSource()
  );
  
  const translationData = j(
  	j(tempFileData1)
      .find(j.ObjectExpression)
      .__paths[0]
  ).toSource();
  
  console.log('wrapper', translationData);
  
  const asyncWrapper = `async () => (${translationData})`
  
  const litteralTransformation = j(tempFileData3)
  // const litteralTransformation = j(asyncWrapper)
    .find(j.Property)
    .forEach(path => {
      console.log(path)
        path.value.key.type = 'Identifier';
	    path.value.key.name = path.value.key.value;
      
        j(path.value)
      		.find(j.Literal)
      		.forEach(path => {
        
              j(path).replaceWith(
                j.awaitExpression(
                  j.callExpression(j.identifier('translate'), [
                    j.literal(path.value.value),
                  ])
                )
              );
          
        	});

    })
  	.toSource();
  
  	console.log(j(litteralTransformation));

    return litteralTransformation;
  
    // AwaitExpression
  

    .forEach(path => {
    	console.log(path)
      j(path).replaceWith(
        j.awaitExpression(
          j.callExpression(j.identifier('translate'), [
            j.literal(path.value.value),
          ])
        )
      );
    })
    // .toSource();
  
  // return j(withIdentifiers)
  	// .find(j.Identifier)
  	// .forEach(path => {
  	// 	console.log(path);
  	// })
  	// .toSource();
  }

*/
