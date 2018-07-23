module.exports = class SaveTranslation {
  constructor({ writeFileAsync, logger }) {
    this.writeFileAsync = writeFileAsync;
    this.logger = logger;
  }

  init = ({ id, translations, translationsDir }) => {
    const fileName = `${id}.json`;
    const jsonData = JSON.stringify(translations);
    this.writeFileAsync(`${translationsDir}/${fileName}`, jsonData, 'utf8');
    this.logger.info(`saved file "${fileName}"`);
  };
};
