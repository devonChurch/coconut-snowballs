import * as React from 'react';
import 'antd/lib/form/style/css';
import 'antd/lib/select/style/css';
import 'antd/lib/divider/style/css';
declare type Translation = object | Array<any>;
declare type Language = string;
declare type Languages = Language[];
declare type Id = string;
declare type ErrorMessage = string;
interface Translations {
    [language: string]: Translation;
}
interface Props {
    children(Translation: any): any;
    id: Id;
    languages: Languages;
    english: Translation;
    getCachedData(id: Id): Promise<any>;
    makeNewTranslation(language: Language, english: Translation): Promise<any>;
}
interface State {
    language: Language;
    translations: Translations;
    isLoading: boolean;
    errorMessage: ErrorMessage;
}
declare class Translate extends React.Component<Props, State> {
    state: {
        language: string;
        translations: {
            [x: string]: Translation;
        };
        isLoading: boolean;
        errorMessage: string;
    };
    componentDidMount(): void;
    handleSelectChange: (language: string) => void;
    startCachedTranslationSequence: (id: string, language: string, english: Translation) => Promise<void>;
    startNewTranslationSequence: (language: string, english: Translation) => Promise<void>;
    addErrorMessage: (errorMessage: string) => void;
    addTranslationsData: (language: string, translations: Translations) => void;
    render(): JSX.Element;
}
export default Translate;
