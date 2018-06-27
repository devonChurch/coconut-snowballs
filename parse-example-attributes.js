const jscodeshift = require("jscodeshift");

const parseId = path => path.value.value.value;

const parseLanguage = path =>
  path.value.value.expression.elements.map(({ value }) => value);

const parseEnglish = path => {
  const createAwaitFunction = path =>
    jscodeshift(path).replaceWith(
      jscodeshift.awaitExpression(
        jscodeshift.callExpression(jscodeshift.identifier("translate"), [
          jscodeshift.literal(path.value.value)
        ])
      )
    );

  const expression = jscodeshift(path.value.value.expression)
    .find(jscodeshift.Literal)
    .forEach(createAwaitFunction)
    .toSource();

  return eval(`async (translate) => (${expression});`);
};

module.exports = example => {
  let id, languages, english;

  jscodeshift(example)
    .findJSXElements("Translate")
    .find(jscodeshift.JSXAttribute)
    .forEach(path => {
      const { name } = path.value.name;

      if (name === "id") {
        id = parseId(path);
      } else if (name === "languages") {
        languages = parseLanguage(path);
      } else if (name === "english") {
        english = parseEnglish(path);
      }
    });

  return { id, languages, english };
};

// - - - - - - - - - - - - - - - - - - - -
/*
<Translate
  id="1a2b3c"
  languages={['ab', 'cd']}
  english={{
    title: 'Hello',
    description: 'This is an example',
    button: 'Click here!',
  }}
>
({ title, description, button }) => (
  <div>
    <h2>{title}</h2>
    <p>{description}</p>
    <button>{button}</button>
  </div>
);
</Translate>
*/
// - - - - - - - - - - - - - - - - - - - -

// module.exports = example => {
//   // console.log("example", example);

//   return jscodeshift(example)
//     .find(jscodeshift.Literal)
//     .forEach(path => {
//       // console.log({ ...path });

//       const { value } = path.value;

//       jscodeshift(path).replaceWith(
//         jscodeshift.awaitExpression(
//           jscodeshift.callExpression(jscodeshift.identifier("translate"), [
//             jscodeshift.literal(value)
//           ])
//         )
//       );
//     })
//     .toSource();
// };
