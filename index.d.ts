import * as React from 'react';
declare type Translations = object | Array<any>;
interface Props {
    children(Translations: any): any;
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
declare class Translate extends React.Component<Props, State> {
    englishOption: {
        code: string;
        name: string;
    };
    options: {
        code: string;
        name: string;
    }[];
    state: {
        currentLanguage: string;
        previousLanguage: any;
        translations: {
            [x: string]: Translations;
        };
        isLoading: boolean;
    };
    componentDidMount(): void;
    componentDidUpdate(prevProps: any, prevState: any, snapshot: any): void;
    getTranslationData: () => void;
    setLoaderOn: () => void;
    setLoaderOff: () => void;
    createSelectOptions: () => any[];
    setCachedTranslationData: ({ id, english }: {
        id: any;
        english: any;
    }) => Promise<void>;
    handleSelectChange: (event: any) => Promise<void>;
    render(): JSX.Element;
}
export default Translate;
