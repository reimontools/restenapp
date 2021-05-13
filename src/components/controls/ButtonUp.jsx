import styled from "styled-components";
import {  getIconByFamily } from "../../helpers/paramHelper";

const ButtonUpStyled = styled.div `
    position: fixed;
    background-color: #ced922;
    width: 30px;
    height: 30px;
    border-radius: 30px;
    display: flex;
    align-items: center; 
    justify-content: center;
    bottom: 5%;
    right: 8%;
    color: white;
    transform: scale(1);
    transition: all 300ms ease;
    cursor: pointer;
`;

const ButtonUp = () => {
    return (
        <ButtonUpStyled>
            {getIconByFamily("add")}
        </ButtonUpStyled>
    );
};

export default ButtonUp;
