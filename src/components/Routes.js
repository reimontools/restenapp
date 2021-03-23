import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { Home, Player, Group, GroupPlayer, Championship, NotFound, Header, User } from "../component";
import styled from "styled-components";

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
                    <Route component={Player} path='/player' />
                    <Route component={User} path='/user' />
                    <Route component={Championship} path='/championship' />
                    <Route component={Group} path='/group' />
                    <Route component={GroupPlayer} path='/group-player/:prm_group_id' />
                    <Route component={Home} path='/' exact />
                    <Route component={NotFound} path='*' />
                </Switch>
            </ContentStyled>
        </Router>
    );
};

export default Routes;
