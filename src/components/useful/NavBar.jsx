// import { NAV_ELEMENTS } from "../../helpers/ParamHelper.js";
import styled from "styled-components";

export const NavStyled = styled.nav `
    position: fixed;
    width: 100%;
    height: 20%;
    top: 0;
    border: 1px #a0138e solid
    /* display: flex; */
    /* flex-direction: column; */
    /* align-items: flex-start; */
    /* justify-content: center; */
    /* z-index:600; */
`;


const NavBar = () => {

    return (
        <>
            <NavStyled >

                {/* {NAV_ELEMENTS.map((item, index) => {
                    return <Element item={item} key={index}/>;
                })} */}
            </NavStyled>
        </>
    );
};

export default NavBar;
