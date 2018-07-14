import * as React from 'react';
import axios from 'axios';

import Form from 'antd/lib/form/';
import 'antd/lib/form/style/css';

import Select from 'antd/lib/select/';
import 'antd/lib/select/style/css';

import Divider from 'antd/lib/divider/';
import 'antd/lib/divider/style/css';

const FormItem = Form.Item;
const Option = Select.Option;

const requestData = data =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, 3000);
  });

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

const asyncMessages = {
  cache: {
    500: 'We encountered an error while requesting our cached data. Will retry your request via the server instead.',
    404: 'We could not find a matching translation in our cache. Going off to translate your request on the server.',
  },
  server: {
    500: 'We are having trouble translating your request on the server. Please try again later.',
    404: 'We could not find a matching translation in our server response. Please try again later.',
  },
};

class Translate extends React.Component<Props, State> {
  state = {
    language: englishSelectOption.code,
    translations: { [englishSelectOption.code]: this.props.english },
    isLoading: false,
    errorMessage: '',
    warningMessage: '',
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
    const translations = await requestData({
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

  handleSelectChange = language => {
    const { translations } = this.state;
    const hasTranslation = translations[language];
    const { id, english } = this.props;
    const { isCachedHook } = getHookReferences({ id, english });

    if (hasTranslation) {
      console.log('get translation from state');
      this.addTranslationsData(language, translations);
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
        this.addWarningMessage(asyncMessages.cache['404']);
        await this.startNewTranslationSequence(language, english);
      }
    } catch (error) {
      console.error(error);
      this.addWarningMessage(asyncMessages.cache['500']);
      await this.startNewTranslationSequence(language, english);
    }
  };

  startNewTranslationSequence = async (language, english) => {
    try {
      this.setState(prevState => ({ ...prevState, isLoading: true }));
      const translations = await this.getNewTranslationData(language, english);
      if (translations[language]) {
        this.addTranslationsData(language, translations);
      } else {
        this.addErrorMessage(asyncMessages.server['404']);
      }
    } catch (error) {
      console.error(error);
      this.addErrorMessage(asyncMessages.server['500']);
    }
  };

  addErrorMessage = errorMessage =>
    this.setState(prevState => ({
      ...prevState,
      isLoading: false,
      warningMessage: '',
      errorMessage,
    }));

  addWarningMessage = warningMessage =>
    this.setState(prevState => ({
      ...prevState,
      isLoading: false,
      warningMessage,
      errorMessage: '',
    }));

  addTranslationsData = (language, translations) =>
    this.setState(prevState => ({
      ...prevState,
      language,
      isLoading: false,
      errorMessage: '',
      warningMessage: '',
      translations: {
        ...prevState.translations,
        ...translations,
        [englishSelectOption.code]: this.props.english,
      },
    }));

  render() {
    const { children, id, languages, english } = this.props;
    const { language, translations, isLoading, errorMessage, warningMessage } = this.state;
    const translation = translations[language] || translations[englishSelectOption.code];
    const hasBeenToServer = Object.keys(translations).length > 1;
    const status =
      (isLoading && 'validating') ||
      (errorMessage && 'error') ||
      (warningMessage && 'warning') ||
      (hasBeenToServer && 'success');

    return (
      <div>
        <div>
          <Form style={{ maxWidth: '25rem' }} onSubmit={() => this.handleSelectChange(language)}>
            <FormItem
              hasFeedback
              validateStatus={status || null}
              help={errorMessage || warningMessage || null}
            >
              <Select
                defaultValue={englishSelectOption.code}
                value={language}
                onChange={this.handleSelectChange}
              >
                {createSelectOptions(languages).map(({ name, code }) => (
                  <Option value={code}>{name}</Option>
                ))}
              </Select>
            </FormItem>
          </Form>
        </div>
        <Divider />
        {children(translation)}
      </div>
    );
  }
}

export default Translate;
