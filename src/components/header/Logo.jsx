import styled from "styled-components";
import logo from '../../assets/images/logo_v1.png';
import { useHistory } from 'react-router-dom'

export const LogoStyled = styled.div `
    height: 100%;
    display: flex;
    align-items: center; 
    justify-content: center;
    img {
        height: 80%;
        cursor: pointer;
    }
`;

const Logo = () => {
    const history = useHistory();
    return (
       <LogoStyled>
            <img src={logo} alt='wenashh'onClick={() => {history.push('/')}}/>
        </LogoStyled>
    );
};

export default Logo;
