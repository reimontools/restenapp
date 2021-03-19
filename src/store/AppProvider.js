import {createContext, useState} from 'react';

const AppContext = createContext();

const AppState = ({children}) => {
    const [barState, setBarState] = useState(false);
    const [globalGroupId, setGlobalGroupId] = useState(0);

    return (
        <AppContext.Provider value={{barState, setBarState, globalGroupId, setGlobalGroupId}}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext };
export default AppState;
