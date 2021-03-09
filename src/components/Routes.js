import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { Welcome, User, Group, NavBar } from "../component";

const Routes = () => {
    return (
        <Router>
            <NavBar />
            <Switch>                    
                <Route component={Welcome} path='/' exact />
                <Route component={User} path='/user' />
                <Route component={Group} path='/group' />
            </Switch>
        </Router>
    );
};

export default Routes;
