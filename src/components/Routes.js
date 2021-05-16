import {BrowserRouter as Router, Switch} from "react-router-dom";
import { Header } from "../component";
import styled from "styled-components";
import { ROUTES, ProtectedRoute } from "../helpers/routeHelper";

export const ContentStyled = styled.div `
    position: absolute;
    width: 100%;
    top: 60px;
    display: flex;
    align-items: center; 
    justify-content: center;
    z-index: 100;
    /* padding-bottom: 20px; */
`;

const Routes = () => {
    return (
        <Router>
            <Header />
            <ContentStyled className="wea">
                <Switch> 
                    {ROUTES.map((route, key) => {
                        return <ProtectedRoute exact path={route.path} component={route.component} key={key} auth={route.auth} allowTo={route.allowTo}/>
                    })}
                </Switch>
            </ContentStyled>
        </Router>
    );
};

export default Routes;