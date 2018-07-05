import * as React from 'react';
import axios from 'axios';

// const requestData = () =>
//   new Promise(resolve => {
//     setTimeout(() => {
//       resolve(`{ text: 'Potato' }`);
//     }, 1000);
//   });

/*
Sequence:
---------

Mount -vs- Update
-----      ------

Mount:
+ On page load
  - Use cached data
+ On Styleguidist Guide code change
  - Fetch new data
  - Ask before fetching

Update:
+ Change <select /> option
  - Get language option from state
  - Unless this is the very first selection against cached data... then we need to fetch


*/

type Translations = object | Array<any>;

interface Props {
  children(Translations): any;
  id: string;
  languages: Array<string>;
  english: Translations;
}

interface State {
  language: string;
  translations: Translations;
  isLoading: boolean;
  errorMessage: string;
}

const cachedTranslations = {};

const englishSelectOption = { code: 'en', name: 'English' }; // English

const allSelectOptions = [
  englishSelectOption,
  { code: 'ar', name: 'العربية' }, // Arabic
  { code: 'zh', name: '中文' }, // Chinese
  { code: 'fr', name: 'Français' }, // French
  { code: 'de', name: 'Deutsch' }, // German
  { code: 'pt', name: 'Português' }, // Portuguese
  { code: 'es', name: 'Español' }, // Spanish
];

const getHookReferences = ({ id, english }) => {
  const cachedHook = cachedTranslations[id];
  const currentHook = JSON.stringify(english);
  const isCachedHook = cachedHook === currentHook;

  return { cachedHook, currentHook, isCachedHook };
};

const createSelectOptions = languages => [
  englishSelectOption,
  ...allSelectOptions.reduce(
    (acc, { code, name }) => (languages.includes(code) ? [...acc, { code, name }] : acc),
    []
  ),
];

class Translate extends React.Component<Props, State> {
  state = {
    language: englishSelectOption.code,
    translations: { [englishSelectOption.code]: this.props.english },
    isLoading: false,
    errorMessage: '',
  };

  componentDidMount() {
    const { id, english } = this.props;
    const { cachedHook, currentHook } = getHookReferences({ id, english });

    if (!cachedHook) {
      console.log('cache | componentDidMount');
      cachedTranslations[id] = currentHook;
    }
  }

  getCachedTranslationData = async id => {
    const response = await axios.get(`/translations/${id}.json`);
    return response.data;
  };

  getNewTranslationData = async (language, english) => {
    const translations = await Promise.resolve({
      fr: {
        plain: 'French Hi!',
      },
      de: {
        plain: 'German Hi!',
      },
    });

    if (translations[language]) {
      return { [language]: translations[language] };
    } else {
      throw new Error('Broken');
    }
  };

  handleSelectChange = event => {
    const language = event.target.value;
    const hasTranslation = this.state.translations[language];
    const { id, english } = this.props;
    const { isCachedHook } = getHookReferences({ id, english });

    if (hasTranslation) {
      console.log('get translation from state');
      this.setState(prevState => ({ ...prevState, language }));
    } else if (isCachedHook) {
      console.log('get translation from cache');
      this.startCachedTranslationSequence(id, language, english);
    } else {
      console.log('get translation dynamicly');
      this.startNewTranslationSequence(language, english);
    }
  };

  startCachedTranslationSequence = async (id, language, english) => {
    try {
      this.setState(prevState => ({ ...prevState, isLoading: true }));
      const translations = await this.getCachedTranslationData(id);
      if (translations[language]) {
        this.addTranslationsData(language, translations);
      } else {
        throw new Error('Broken');
      }
    } catch (error) {
      console.error(error);
      this.addErrorMessage(
        'We could not find a matching translation in our cache. Going off to translate you request on the server.'
      );
    }
  };

  startNewTranslationSequence = async (language, english) => {
    try {
      this.setState(prevState => ({ ...prevState, isLoading: true }));
      const translations = await this.getNewTranslationData(language, english);
      if (translations[language]) {
        this.addTranslationsData(language, translations);
      } else {
        throw new Error('Broken');
      }
    } catch (error) {
      console.error(error);
      this.addErrorMessage(
        'We are having trouble translating you request on the server. Please try again latter.'
      );
    }
  };

  addErrorMessage = errorMessage =>
    this.setState(prevState => ({ ...prevState, isLoading: false, errorMessage }));

  addTranslationsData = (language, translations) =>
    this.setState(prevState => ({
      ...prevState,
      language,
      isLoading: false,
      errorMessage: '',
      translations: {
        ...prevState.translations,
        ...translations,
        [englishSelectOption.code]: this.props.english,
      },
    }));

  render() {
    const { children, id, languages, english } = this.props;
    const { language, translations, isLoading, errorMessage } = this.state;
    const translation = translations[language] || translations[englishSelectOption.code];

    return (
      <div>
        <div>
          <select value={language} onChange={this.handleSelectChange}>
            {createSelectOptions(languages).map(({ name, code }) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
          {isLoading && <span>Loading</span>}
          {errorMessage && <span>{errorMessage}</span>}
        </div>
        <hr />
        {children(translation)}
      </div>
    );
  }
}

export default Translate;
