import { Component } from "react";

class Translate extends Component {
  state = {
    language: "en",
    translations: null
  };

  englishOption = { code: "en", name: "English" };

  options = [
    this.englishOption,
    { code: "ar", name: "Arabic" },
    { code: "zh", name: "Chinese" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "pt", name: "Portuguese" },
    { code: "es", name: "Spanish" }
  ];

  createSelectOptions = () => {
    const {
      options,
      props: { languages },
      englishOption
    } = this;

    return [
      englishOption,
      ...options.reduce(
        (acc, { code, name }) =>
          languages.includes(code) ? [...acc, { code, name }] : acc
      )
    ];
  };

  testIsEnglish = language => {
    const { state, options, englishOption } = this;

    return (language || state.language) === englishOption.code;
  };

  handleSelectChange = async event => {
    const language = event.target.value;
    const translations = this.testIsEnglish(language)
      ? this.props.english
      : this.state.translations || JSON.parse(await requestData());

    this.setState({ language, translations });
  };

  render = () => {
    const { children, id, languages, english } = this.props;
    const { language, translations } = this.state;
    const translation = this.testIsEnglish() ? english : translations[language];

    return (
      <div>
        <div>
          <select value={language} onChange={this.handleSelectChange}>
            {this.createSelectOptions().map(({ name, code }) => (
              <option value={code}>{name}</option>
            ))}
          </select>
        </div>
        {children(translation)}
      </div>
    );
  };
}
