# Coconut Snowballs :chestnut: :snowman: :8ball:

[![Build Status](https://travis-ci.com/devonChurch/coconut-snowballs.svg?branch=master)](https://travis-ci.com/devonChurch/coconut-snowballs) [![npm version](https://badge.fury.io/js/coconut-snowballs.svg)](https://badge.fury.io/js/coconut-snowballs)

[![typescript](https://user-images.githubusercontent.com/15273233/40872275-a61d4660-669f-11e8-8edf-860f1947759f.png)](https://www.typescriptlang.org/) [![code style prettier](https://img.shields.io/badge/code_style-prettier-FF69A4.svg)](https://prettier.io/)

## What

This system aims to demonstrate how your React components are represented in various language scenarios.

Users can quickly switch between languages and see the results reflected inside your components. They can also leverage the power of the interactive [_Styleguidist_](https://react-styleguidist.js.org/) **REPEL** to customise components and see those changes are represented via real-time translations.

## Why

This allows _designers_, _developers_ and _QA_ to rapidly prototype and stress test components from a localisation perspective.

## Usage

The system in split into two main portions, **Prepare** and **Display**. The two work together ensuring that we reduce the usage of the _AWS Translation API_ to as little as possible.

### Prepare

We pre-render your components default translation references at build time. This acts as a cache to reduce the burden of any real-time translations to only necessary scenarios. 

We enrich your _Styleguidist_ build by running the following sequence via our CLI functionality.

#### Invoke the CLI

The CLI sequence automates the conversion of your _Styleguidist_ _Markdown_ (`.md`) files into translated `.json` files. These `.json` files then act as a cache and are targeted during run time whenever possible to avoid exhausting the real-time _AWS Translation API_.

![translate-cli](https://user-images.githubusercontent.com/15273233/43682128-cf315f28-98bd-11e8-88bc-fe27a2ce66b0.gif)

+ Install the _Coconut Snowballs_ library as a local _(or global dependancy)_.
  ```
  npm install --save-dev coconut-snowballs
  ```

+ If you installed the library locally, create an `npm` script hook for convenience.

  `package.json`
  ```js
  {
    ...
    "scripts": {
      "translate": "coconut-snowballs"
    },
    ...
  }
  ```

+ Invoke the CLI and supply your _Markdown_ **source** and _Styleguidist_ **asset** directories.
  ```
  npm run translate -- --markdown="./src" --styleguidist="./assets"
  ```

  + **Note:** If you are running the CLI _"locally"_ make sure to have your _AWS **access** / **secret** keys_ setup.

+ Tell _Styleguidist_ where to find your cached translation files.

  `styleguide.config.js`
  ```js
  module.exports = {
    assetsDir: "./assets"
  };
  ```

##### Example
An example of fetching pre-translated cached `json` data inside of the _Styleguidist_ documentation.

![translate-cache](https://user-images.githubusercontent.com/15273233/43682028-4c0d2094-98ba-11e8-90b8-a2946b4a1a69.gif)



#### Real-time translations

If a user customises the content inside the interactive _Styleguidist_ **REPEL** our cached translations are no longer relevant. In that regard we need to setup an endpoint to to preform real-time transitions.

You can set your endpoint up however you like but we have provided you a module that can handle the translation sequence. In the example below we are using [Hapi](https://hapijs.com/) to create an API along side our `json` translation sequence.

`index.js`
```js
const Hapi = require("hapi");
const translate = require("coconut-snowballs/json");
const server = Hapi.server({ host: "localhost", port: 8000 });

server.route({
  method: "POST",
  path: "/translate",
  options: { cors: true },
  handler: ({ payload }) => translate(payload)
});

(async () => {
  try { await server.start(); }
  catch (err) { process.exit(1); }
})();

```

##### Example
An example of fetching real-time translated `json` data inside of the _Styleguidist_ documentation.

![translate-new](https://user-images.githubusercontent.com/15273233/43682027-4be1bf9e-98ba-11e8-8f98-7f12718a32be.gif)



### Display

To display your component with localisation functionality we need to enrich the _Styleguidist_ documentation with our translation system.

The CLI sequence is dependant on setting up the display scaffold correctly.

+ Create a `<Translate />` component. This will act as a _"hook"_ for the CLI to use inside the _Markdown_ documentation and handle the _async_ translation sequences (_"get cached"_ and _"make new"_).

  `Translate.js`
  ```js
  import React, { Component } from "react";
  import CoconutSnowballs from "coconut-snowballs";
  import axios from "axios";
  
  export default class Translate extends Component {
    getCachedData = async id => {
      // Get cahced translation data from the ./asset directory.
      const response = await axios.get(`/translations/${id}.json`);
      return response.data;
    };
  
    makeNewTranslation = async (language, english) => {
      // Supply our Hapi API with JSON and recieve new translation data .
      const json = JSON.stringify(english);
      const response = await axios.post(`http://my-translate-endpoint/translate`, { language, json });
      return response.data;
    };
  
    render() {
      const { props, getCachedData, makeNewTranslation } = this;
      return (
        <CoconutSnowballs {...props}
          getCachedData={getCachedData}
          makeNewTranslation={makeNewTranslation}
        />
      );
    }
  }
  ```

+ Enrich your component(s) with the `<Translate />` component. The component expects three props which are used to create _cached_ and _new_ translations as easily as possible:
  + **id:** The `id` reference the cached `json` data will be _saved_ and _fetched_ under.
  + **languages:** An array of [language code(s)](https://docs.aws.amazon.com/translate/latest/dg/API_TranslateText.html) that the current component supports.
  + **english:** An object containing the `string` references that translations will be based on.

  **Note:** The component **must** be called `<Translate />` in your _Markdown_ examples

  `Button.md`

  ```js
  const Translate = require("./Translate").default;
  <Translate
    id="1a2b3c"
    languages={["ar", "zh", "fr", "de", "pt", "es"]}
    english={{ primary: "Update", success: "Accept", danger: "Delete" }}>
    {t => [
      <Button version="primary">{t.primary}</Button>,
      <Button version="success">{t.success}</Button>,
      <Button version="danger">{t.danger}</Button>
    ]}
  </Translate>;
  ```

## License

MIT
