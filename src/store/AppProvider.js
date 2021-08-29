import {createContext, useState} from 'react';
import cookie from 'js-cookie';
import jwt_decode from 'jwt-decode';
export const AppContext = createContext();

const AppProvider = ({children}) => {
    const defaultUser = null;
    const cookieUser = 'USERINFO';
    const [barState, setBarState] = useState(false);

    const getUser = () => {
        var user = cookie.getJSON(cookieUser);
        if (user) {
            return jwt_decode(user.token);
        };
        return defaultUser;
    };

    const [user, setUser] = useState(getUser());

    const setTokenDataInCookieAndContext = tokenData => {
        cookie.set(cookieUser, tokenData);
        setUser(jwt_decode(tokenData.token));
    };

    const logOut = () => {
        cookie.remove(cookieUser);
        setUser(defaultUser);
    };

    const isLogged = () => {
        if (user) {
            return true;
        } else {
            return false;
        };
    };

    const contentValue = { user, setTokenDataInCookieAndContext, logOut, isLogged, barState, setBarState };

    return (
        <AppContext.Provider value={contentValue}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;

