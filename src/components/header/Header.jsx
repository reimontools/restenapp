import styled from "styled-components";
import { NavBar, Logo } from "../../component";

export const HeaderStyled = styled.div `
    position: fixed;
    width: 100%;
    height: 10%;
    top: 0;
    background-color: #0e70b8;
    display: flex;
    align-items: center; 
    justify-content: space-around;
    div {
        height: 100%;
    }
    img {
        height: 100%;
    }
`;

const Header = () => {
    return (
       <HeaderStyled>
           <Logo />
           <NavBar />
        </HeaderStyled>
    );
};

export default Header;
