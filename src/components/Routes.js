import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { Welcome, User, Group, Header } from "../component";

const Routes = () => {
    return (
        <Router>
            <Header />
            <Switch>                    
                <Route component={Welcome} path='/' exact />
                <Route component={User} path='/user' />
                <Route component={Group} path='/group' />
            </Switch>
        </Router>
    );
};

export default Routes;
