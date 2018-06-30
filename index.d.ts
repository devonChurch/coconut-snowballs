import * as React from 'react';
declare type Translations = string | number | object | Array<any>;
interface Props {
    children(Translations: any): any;
    id: string;
    languages: Array<string>;
    english: Translations;
}
interface State {
    language: string;
    translations: Translations | null;
}
declare class Translate extends React.Component<Props, State> {
    state: {
        language: string;
        translations: any;
    };
    englishOption: {
        code: string;
        name: string;
    };
    options: {
        code: string;
        name: string;
    }[];
    createSelectOptions: () => any[];
    testIsEnglish: (language?: string) => boolean;
    handleSelectChange: (event: any) => Promise<void>;
    render(): JSX.Element;
}
export default Translate;
