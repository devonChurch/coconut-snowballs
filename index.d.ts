import * as React from 'react';
import 'antd/lib/form/style/css';
import 'antd/lib/select/style/css';
import 'antd/lib/divider/style/css';
declare type Translations = object | Array<any>;
interface Props {
    children(Translations: any): any;
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
declare class Translate extends React.Component<Props, State> {
    state: {
        language: string;
        translations: {
            [x: string]: Translations;
        };
        isLoading: boolean;
        errorMessage: string;
        warningMessage: string;
    };
    componentDidMount(): void;
    getCachedTranslationData: (id: any) => Promise<any>;
    getNewTranslationData: (language: any, english: any) => Promise<{
        [x: number]: any;
    }>;
    handleSelectChange: (language: any) => void;
    startCachedTranslationSequence: (id: any, language: any, english: any) => Promise<void>;
    startNewTranslationSequence: (language: any, english: any) => Promise<void>;
    addErrorMessage: (errorMessage: any) => void;
    addWarningMessage: (warningMessage: any) => void;
    addTranslationsData: (language: any, translations: any) => void;
    render(): JSX.Element;
}
export default Translate;
