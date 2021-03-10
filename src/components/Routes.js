import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { Home, User, Group, Header } from "../component";
import styled from "styled-components";

export const ContentStyled = styled.div `
    position: fixed;
    width: 100%;
    top: 12%;
    display: flex;
    align-items: center; 
    justify-content: center;
`;

const Routes = () => {
    return (
        <Router>
            <Header />
            <ContentStyled>
                <Switch>                    
                    <Route component={Home} path='/' exact />
                    <Route component={User} path='/user' />
                    <Route component={Group} path='/group' />
                </Switch>
            </ContentStyled>
        </Router>
    );
};

export default Routes;
