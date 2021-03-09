import {createContext, useState} from 'react';

const AppContext = createContext();

const AppState = ({children}) => {
    const [barState, setBarState] = useState(false);

    return (
        <AppContext.Provider value={{barState, setBarState}}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext };
export default AppState;
