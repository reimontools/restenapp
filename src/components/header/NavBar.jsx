import { NAV_ELEMENTS } from "../../helpers/paramHelper.js";
import styled from "styled-components";
import { useContext } from 'react'
import { AppContext } from "../../store/AppProvider";
import { NavLink } from "react-router-dom";

export const NavStyled = styled.nav `
    width: auto;
    height: 100%;
    display: flex;
    align-items: center; 
    justify-content: flex-end;
    .navlink {
        font-size: 15px;
        font-family: sundayBest;
        color: rgb(55, 55, 55);
        text-decoration: none;
        padding-left: 10px;
        &:hover {
            color: #ced922;
        };
        &.active {
            color: #ced922;
        };
    };
`;

const NavBar = () => {
    const { barState } = useContext(AppContext);
    return (
        <>
            <NavStyled open={ barState }>
                {NAV_ELEMENTS.map((item, index) => {
                    return (
                        <NavLink
                            className="navlink" 
                            key={index}
                            onClick={() => console.log('OptionClick')} 
                            to={item.path} 
                            activeClassName="active" 
                            exact>
                                {item.title}
                        </NavLink>
                    );
                })} 
            </NavStyled>
        </>
    );
};

export default NavBar;
