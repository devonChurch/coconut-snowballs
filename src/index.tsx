import * as React from 'react';
import axios from 'axios';

// console.log('axios', axios);

// const requestData = () =>
//   new Promise(resolve => {
//     setTimeout(() => {
//       resolve(`{ text: 'Potato' }`);
//     }, 1000);
//   });

type Translations = object | Array<any>;

interface Props {
  children(Translations): any;
  id: string;
  languages: Array<string>;
  english: Translations;
}

interface State {
  currentLanguage: string;
  previousLanguage: string;
  translations: Translations;
  isLoading: boolean;
}

const cachedTranslations = {};

class Translate extends React.Component<Props, State> {
  englishOption = { code: 'en', name: 'English' }; // English

  options = [
    this.englishOption,
    { code: 'ar', name: 'العربية' }, // Arabic
    { code: 'zh', name: '中文' }, // Chinese
    { code: 'fr', name: 'Français' }, // French
    { code: 'de', name: 'Deutsch' }, // German
    { code: 'pt', name: 'Português' }, // Portuguese
    { code: 'es', name: 'Español' }, // Spanish
  ];

  state = {
    currentLanguage: this.englishOption.code,
    previousLanguage: null,
    translations: { [this.englishOption.code]: this.props.english },
    isLoading: false,
  };

  componentDidMount() {
    // get cached data OR get new data
    // - is the current english data the same as the original reference?
    //   - YES = get cached data

    const { id, english } = this.props;
    const originalHook = cachedTranslations[id];
    const currentHook = JSON.stringify(english);

    if (!originalHook) {
      cachedTranslations[id] = currentHook;
    } else {
      this.getTranslationData();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('componentDidUpdate', { prevProps, prevState, snapshot });
    const shouldGetData =
      JSON.stringify(prevProps.english) !== JSON.stringify(this.props.english) ||
      prevState.currentLanguage !== this.state.currentLanguage;

    console.log(
      `shouldGetData`,
      `${JSON.stringify(prevProps.english)} !== ${JSON.stringify(this.props.english)}`,
      `${prevState.currentLanguage} !== ${this.state.currentLanguage}`
    );
    if (shouldGetData) {
      this.getTranslationData();
    }
  }

  getTranslationData = () => {
    const { id, english } = this.props;
    const { isLoading } = this.state;
    const originalHook = cachedTranslations[id];
    const currentHook = JSON.stringify(english);
    const shouldGetCachedData = !isLoading && originalHook === currentHook;
    const shouldGetNewData = !isLoading && originalHook !== currentHook;
    console.log('cached data?', originalHook === currentHook);
    console.log('originalHook', originalHook);
    console.log('currentHook', currentHook);
    console.log('isLoading', isLoading);
    console.log('shouldGetCachedData', shouldGetCachedData);
    console.log('shouldGetNewData', shouldGetNewData);

    if (shouldGetCachedData) {
      // const translations = await this.setCachedTranslationData();
      // Try and get from static cached transcations
      // Or no request permission to dynamicly translate
      console.log('setting cached data on update');
      // this.setLoaderOn();
      this.setCachedTranslationData({ id, english });
    } else if (shouldGetNewData) {
      // Request permission to dynamicly translate
      console.log('setting custom data on update');
      // this.setLoaderOn();
      // ......
    }
  };

  setLoaderOn = () =>
    this.setState(prevState => ({
      ...prevState,
      isLoading: true,
    }));

  setLoaderOff = () =>
    this.setState(prevState => ({
      ...prevState,
      isLoading: false,
    }));

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

  // testIsEnglish = (language?: string): boolean => {
  //   const { state, options, englishOption } = this;

  //   return (language || state.currentLanguage) === englishOption.code;
  // };

  setCachedTranslationData = async ({ id, english }) => {
    this.setLoaderOn();
    let translations;
    try {
      const response = await axios.get(`/translations/${id}.json`);
      translations = response.data;
      console.log('setCachedTranslationData', translations);
      this.setState(prevState => ({
        ...prevState,
        translations: {
          ...translations,
          [this.englishOption.code]: this.props.english,
        },
      }));
    } catch (error) {
      console.error(error);
    }
    // cachedTranslations[id] = currentHook;
    this.setLoaderOff();

    // return translations;
  };

  handleSelectChange = async event => {
    const currentLanguage = event.target.value;
    // const translations = this.testIsEnglish(language) ? {} : await this.setCachedTranslationData();

    // this.setState({
    //   language,
    //   translations: {
    //     ...this.state.translations,
    //     ...translations,
    //   },
    // });
    this.setState(prevState => ({
      ...prevState,
      currentLanguage,
      previousLanguage: this.state.currentLanguage,
    }));
  };

  render() {
    const { children, id, languages, english } = this.props;
    const { currentLanguage, previousLanguage, translations, isLoading } = this.state;
    console.log(`translations[${currentLanguage}]`);
    const translation =
      translations[currentLanguage] ||
      translations[previousLanguage] ||
      translations[this.englishOption.code];
    console.log(`translation`, translation);
    // const translation = this.testIsEnglish() ? english : translations[language];

    return (
      <div>
        <div>
          <select value={currentLanguage} onChange={this.handleSelectChange}>
            {this.createSelectOptions().map(({ name, code }) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
          {isLoading && <span>Loading</span>}
        </div>
        {children(translation)}
      </div>
    );
  }
}

export default Translate;
