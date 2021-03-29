import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { Home, SignIn, Player, Group, GroupPlayer, Championship, NotFound, Header, User } from "../component";
import styled from "styled-components";
import { ProtectedRoute, UnProtectedRoute } from "../helpers/routeHelper";

export const ContentStyled = styled.div `
    position: absolute;
    width: 100%;
    top: 12%;
    display: flex;
    align-items: center; 
    justify-content: center;
    z-index: 100;
`;

const Routes = () => {
    return (
        <Router>
            <Header />
            <ContentStyled>
                <Switch> 
                    <ProtectedRoute component={User} path='/user' how={['Admin']} />      
                    <ProtectedRoute component={Player} path='/player' />
                    <ProtectedRoute component={Championship} path='/championship' />
                    <ProtectedRoute component={Group} path='/group' />
                    <ProtectedRoute component={GroupPlayer} path='/group-player/:prm_group_id' />
                    <UnProtectedRoute component={SignIn} path='/sign-in' />
                    <ProtectedRoute exact component={Home} path='/' how={['*']} />
                    <Route component={NotFound} path='*' />
                </Switch>
            </ContentStyled>
        </Router>
    );
};

export default Routes;