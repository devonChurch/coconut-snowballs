module.exports = class MakeTranslation {
  constructor({ awsTranslate, logger }) {
    this.awsTranslate = awsTranslate;
    this.logger = logger;
  }

  // AWS Translation response.
  // ```
  // {
  //   "TranslatedText": "Bonjour",
  //   "SourceLanguageCode": "en",
  //   "TargetLanguageCode": "fr"
  // }
  // ```
  createTranslator = language => content =>
    new Promise((resolve, reject) =>
      this.awsTranslate.translateText(
        { SourceLanguageCode: 'en', TargetLanguageCode: language, Text: content },
        (error, response = {}) => {
          const translation = response.TranslatedText;
          const isError = error || !translation;
          isError ? reject(error) : resolve(translation);
        }
      )
    );

  init = async ({ id, languages, english }) => {
    let translations = {};

    for (const language of languages) {
      const translator = this.createTranslator(language);
      let translation = null;
      try {
        translation = await english(translator);
        this.logger.info(`made "en" --> "${language}" translation`);
        translations = {
          ...translations,
          [language]: translation,
        };
      } catch (error) {
        this.logger.error(error);
        this.logger.warn(`problem with "en" --> "${language}" translation`);
        this.logger.info(`will not add "${language}" translation to the cache`);
      }
    }

    return { id, translations };
  };
};
