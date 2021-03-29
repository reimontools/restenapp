import {createContext, useState} from 'react';
import cookie from 'js-cookie';
import jwt_decode from 'jwt-decode';
export const AppContext = createContext();

const AppProvider = ({children}) => {
    const defaultUser = {id: 0, rol: 'Stranger'};
    const cookieUser = 'USERINFO';

    const getUser = () => {
        var user = cookie.getJSON("USERINFO");
        if (user) {
            return jwt_decode(user.token);
        };
        return defaultUser;
    };

    const [user, setUser] = useState(getUser());
    const signIn = data => {
        cookie.set(cookieUser, data);
        setUser(jwt_decode(data.token));
    };
    const logOut = () => {
        cookie.remove(cookieUser);
        setUser(defaultUser);
    };
    const isLogged = () => {
        if (user.id === 0) {
            return false;
        } else {
            return true;
        };
    };

    const [barState, setBarState] = useState(false);

    const contentValue = { user, signIn, logOut, isLogged, barState, setBarState };
    return (
        <AppContext.Provider value={contentValue}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
