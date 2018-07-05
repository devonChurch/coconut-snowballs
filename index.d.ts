import * as React from 'react';
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
    };
    componentDidMount(): void;
    getCachedTranslationData: (id: any) => Promise<any>;
    getNewTranslationData: (language: any, english: any) => Promise<{
        [x: number]: any;
    }>;
    handleSelectChange: (event: any) => void;
    startCachedTranslationSequence: (id: any, language: any, english: any) => Promise<void>;
    startNewTranslationSequence: (language: any, english: any) => Promise<void>;
    addTranslationsData: (language: any, translations: any) => void;
    render(): JSX.Element;
}
export default Translate;
