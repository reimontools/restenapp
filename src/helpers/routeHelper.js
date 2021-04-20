import {Redirect, Route} from "react-router-dom";
import useAppContext from '../hooks/useAppContext';

import SignIn from '../components/views/SignIn';
import Player from '../components/views/Player';
import Against from '../components/views/Against';
import Seed from '../components/views/Seed';
import Championship from '../components/views/Championship';
import User from '../components/views/User';
import PlayerResult from '../components/views/PlayerResult';
import Home from '../components/views/Home';
import Match from '../components/views/Match';
import NotFound from '../components/views/NotFound';

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
        title: 'Against',
        path: '/championship/against/:prm_championship_id',
        component: Against, 
        allowTo: ['Admin', 'Coach'],
        showInBar: false,
        auth: 'auth'
    },
    {
        title: 'Seed',
        path: '/championship/seed/:prm_championship_id',
        component: Seed, 
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
        title: 'Sign In',
        path: '/sign-in',
        component: SignIn, 
        allowTo: ['*'],
        showInBar: false,
        auth: 'nonAuth'
    },
    {
        title: 'Match',
        path: '/match/:prm_group_id',
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
                    if (!isLogged()) return <Redirect to="/sign-in" />
                    if (!allowTo.includes(user.rol) && !allowTo.includes('*')) return <Redirect to="/" />
                    return <Component />
                })}
            </Route>
        );
    };
};
