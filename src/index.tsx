import * as React from 'react';
import axios from 'axios';

// console.log('axios', axios);

// const requestData = () =>
//   new Promise(resolve => {
//     setTimeout(() => {
//       resolve(`{ text: 'Potato' }`);
//     }, 1000);
//   });

type Translations = string | number | object | Array<any>;

interface Props {
  children(Translations): any;
  id: string;
  languages: Array<string>;
  english: Translations;
}

interface State {
  language: string;
  translations: Translations | null;
}

class Translate extends React.Component<Props, State> {
  state = {
    language: 'en',
    translations: null,
  };

  englishOption = { code: 'en', name: 'English' };

  options = [
    this.englishOption,
    { code: 'ar', name: 'Arabic' },
    { code: 'zh', name: 'Chinese' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'es', name: 'Spanish' },
  ];

  createSelectOptions = () => {
    const {
      options,
      props: { languages },
      englishOption,
    } = this;

    return [
      englishOption,
      ...options.reduce(
        (acc, { code, name }) => (languages.includes(code) ? [...acc, { code, name }] : acc),
        []
      ),
    ];
  };

  testIsEnglish = (language?: string): boolean => {
    const { state, options, englishOption } = this;

    return (language || state.language) === englishOption.code;
  };

  getPreTranslatedData = async () => {
    const { id, english } = this.props;
    let translations;
    try {
      // const response = await axios.get(`/translations?id=${id}`);
      const response = await axios.get(`/translations/${id}.json`);
      translations = response.data;
      console.log(translations);
    } catch (error) {
      console.error(error);
      translations = english;
    }

    return translations;
  };

  handleSelectChange = async event => {
    const language = event.target.value;
    const translations = this.testIsEnglish(language)
      ? this.props.english
      : // : this.state.translations || JSON.parse(`${await this.getPreTranslatedData()}`);
        this.state.translations || (await this.getPreTranslatedData());

    this.setState({ language, translations });
  };

  render() {
    const { children, id, languages, english } = this.props;
    const { language, translations } = this.state;
    const translation = this.testIsEnglish() ? english : translations[language];

    return (
      <div>
        <div>
          <select value={language} onChange={this.handleSelectChange}>
            {this.createSelectOptions().map(({ name, code }) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>
        {children(translation)}
      </div>
    );
  }
}

export default Translate;
