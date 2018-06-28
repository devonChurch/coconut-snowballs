const AWS = require("aws-sdk");
// const Translate = require("aws-sdk/Translate");

AWS.config.region = "us-east-1";
// const translate = new AWS.Translate({ apiVersion: "2017-07-01" });
const translate = new AWS.Translate({ apiVersion: "2017-07-01" });

module.exports = (TargetLanguageCode, SourceLanguageCode = "en") => Text =>
  new Promise((resolve, reject) => {
    translate.translateText(
      {
        SourceLanguageCode,
        TargetLanguageCode,
        Text
      },
      (error, response) => {
        if (error) reject(error);
        resolve(response.TranslatedText);
      }
    );
  });

// {
//   "TranslatedText": "Bonjour",
//   "SourceLanguageCode": "en",
//   "TargetLanguageCode": "fr"
// }
