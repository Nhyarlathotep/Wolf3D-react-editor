import {createContext} from 'react';

export const Context = createContext({
    theme: false,
    toggleTheme: () => {},
    editor: null,
});