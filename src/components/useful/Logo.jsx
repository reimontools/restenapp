import styled from "styled-components";
import logo from '../../assets/images/logo_v1.png';

export const LogoStyled = styled.div `
    height: 100%;
    display: flex;
    align-items: center; 
    justify-content: center;
    img {
        height: 80%;
    }
`;

const Logo = () => {
    return (
       <LogoStyled>
            <img src={logo} alt='wenashh'/>
        </LogoStyled>
    );
};

export default Logo;
