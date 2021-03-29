import {Redirect, Route} from "react-router-dom";
import useAppContext from '../hooks/useAppContext';

export const ProtectedRoute = ({component: Component, how = ['Admin', 'Coach'], ...options}) => {
    const { user, isLogged } = useAppContext();
    return (
        <Route {...options}>
            {(() => {
                if (!isLogged())
                    return <Redirect to="/sign-in" />
                if (!how.includes(user.rol, "*"))
                    return <Redirect to="/" />
                else 
                    return <Component />
            })}
        </Route>
    );
};

export const UnProtectedRoute = ({component: Component, ...options}) => {
    const { isLogged } = useAppContext();
    return (
        <Route {...options}>
            {!isLogged() ? (<Component />) : (<Redirect to="/" />)}
        </Route>
    );
};