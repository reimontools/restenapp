import {Redirect, Route} from "react-router-dom";
import useAppContext from '../hooks/useAppContext';
import { LogIn, Player, Group, Championship, User, PlayerResult, Home, Match, NotFound } from "../components/component.views";

export const ROUTES = [
    {
        title: 'Home',
        path: '/',
        component: Home, 
        allowTo: ['*'],
        showInBar: true,
        auth: 'auth'
    },
    {
        title: 'Player Result',
        path: '/player-result',
        component: PlayerResult, 
        allowTo: ['*'], 
        showInBar: true,
        auth: 'auth'
    },
    {
        title: 'Group',
        path: '/championship/group/:prm_championship_id/:prm_championship_type_id',
        component: Group, 
        allowTo: ['Admin', 'Coach'],
        showInBar: false,
        auth: 'auth'
    },
    {
        title: 'Championship',
        path: '/championship',
        component: Championship, 
        allowTo: ['Admin', 'Coach'],
        showInBar: true,
        auth: 'auth'
    },
    {
        title: 'Players',
        path: '/player',
        component: Player, 
        allowTo: ['Admin', 'Coach'],
        showInBar: true,
        auth: 'auth'
    },
    {
        title: 'Users',
        path: '/user',
        component: User, 
        allowTo: ['Admin'],
        showInBar: true,
        auth: 'auth'
    },
    {
        title: 'Log In',
        path: '/log-in',
        component: LogIn, 
        allowTo: ['*'],
        showInBar: false,
        auth: 'nonAuth'
    },
    {
        title: 'Match',
        path: '/match/:prm_championship_id/:prm_championship_type_id/:prm_group_id',
        component: Match, 
        allowTo: ['Admin', 'Coach'],
        showInBar: false,
        auth: 'auth'
    },
    {
        title: 'Not Found',
        path: '*',
        component: NotFound, 
        allowTo: ['*'],
        showInBar: false,
        auth: 'all'
    }
];

export const ProtectedRoute = ({component: Component, allowTo = ['*'], auth, ...options}) => {
    const { user, isLogged } = useAppContext();
    if (auth === "all") {
        return (
            <Route {...options}>
                <Component />
            </Route>
        );
    };
    if (auth === "nonAuth") {
        return (
            <Route {...options}>
                {!isLogged() ? (<Component />) : (<Redirect to="/" />)}
            </Route>
        );
    };
    if (auth === "auth") {
        return (
            <Route {...options}>
                {(() => {
                    if (!isLogged()) return <Redirect to="/log-in" />
                    if (!allowTo.includes(user.rol) && !allowTo.includes('*')) return <Redirect to="/" />
                    return <Component />
                })}
            </Route>
        );
    };
};
