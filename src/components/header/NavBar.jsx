import { NAV_ELEMENTS } from "../../helpers/paramHelper.js";
import styled from "styled-components";
import { useContext } from 'react'
import { AppContext } from "../../store/AppProvider";
import { NavLink } from "react-router-dom";
import { MEDIUM_SCREEN_SIZE_PX } from "../../helpers/paramHelper";

export const NavStyled = styled.nav `
    position: relative;
    bottom: 0;
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

    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        width: 100vw;
        height: 100vh;
        background-color: #0e70b8;
        flex-direction: column;
        align-items: center; 
        justify-content: space-evenly;
        position: fixed;
        bottom: ${({ open }) => open ? '0' : '100%'};
        left: 0;
        transition: all .5s ease-in-out;
    };
`;

const NavBar = () => {
    const { barState, setBarState } = useContext(AppContext);
    return (
        <>
            <NavStyled open={ barState }>
                {NAV_ELEMENTS.map((item, index) => {
                    return (
                        <NavLink
                            className="navlink" 
                            key={index}
                            onClick={() => setBarState(false)} 
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
