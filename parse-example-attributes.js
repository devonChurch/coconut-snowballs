const jscodeshift = require("jscodeshift");

// console.log("jscodeshift", jscodeshift);

// const j = jscodeshift;

module.exports = example => {
  let extractedId, extractedLanguages, extractedData;

  jscodeshift(example)
    .findJSXElements("Translate")
    .find(jscodeshift.JSXAttribute)
    .forEach(path => {
      // console.log(path);
      const { name } = path.value.name;

      if (name === "id") {
        extractedId = path.value.value.value;
      } else if (name === "languages") {
        // extractedLanguages = jscodeshift(
        //   path.value.value.expression
        // ).toSource();
        extractedLanguages = path.value.value.expression.elements.map(
          ({ value }) => value
        );
        // JSON.parse(
        //   jscodeshift(path.value.value.expression).toSource()
        // );
      } else if (name === "english") {
        extractedData = jscodeshift(path.value.value.expression)
          .find(jscodeshift.Literal)
          .forEach(path => {
            const { value } = path.value;

            jscodeshift(path).replaceWith(
              jscodeshift.awaitExpression(
                jscodeshift.callExpression(
                  jscodeshift.identifier("translate"),
                  [jscodeshift.literal(value)]
                )
              )
            );
          })
          .toSource();
      }
    });

  // console.log({extractedId, extractedLanguages, extractedData});

  return { extractedId, extractedLanguages, extractedData };
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
