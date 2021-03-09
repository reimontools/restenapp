import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { Welcome, User, Group, Header } from "../component";
import styled from "styled-components";

export const ContentStyled = styled.div `
    position: fixed;
    width: 100%;
    top: 10%;
`;

const Routes = () => {
    return (
        <Router>
            <Header />
            <ContentStyled>
                <Switch>                    
                    <Route component={Welcome} path='/' exact />
                    <Route component={User} path='/user' />
                    <Route component={Group} path='/group' />
                </Switch>
            </ContentStyled>
        </Router>
    );
};

export default Routes;
