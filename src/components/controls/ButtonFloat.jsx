import styled from "styled-components";
import {  getIconByFamily, MEDIUM_SCREEN_SIZE_PX } from "../../helpers/paramHelper";

const ButtonUpStyled = styled.div `
    position: fixed;
    background-color: #ced922;
    width: 45px;
    height: 45px;
    border-radius: 100%;
    display: flex;
    align-items: center; 
    justify-content: center;
    bottom: 5%;
    right: 8%;
    color: white;
    transition: all 300ms ease;
    cursor: pointer;
 
    &:hover {
        transform: ${({ hover }) => hover ? 'scale(1.2)' : 'none'};
    };

    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        width: 40px;
        height: 40px;
        border-radius: 40px;
        &:hover {
            transform: none;
        };
    };
`;

const ButtonFloat =  {
    Icon: ({...buttonFloatProps}) => {
        return (
            <ButtonUpStyled {...buttonFloatProps}>
                {getIconByFamily("add")}
            </ButtonUpStyled>
        );
    }
};

export default ButtonFloat;
