import styled from "styled-components";
import {  getIconByFamily, MEDIUM_SCREEN_SIZE_PX } from "../../helpers/paramHelper";

const ButtonUpStyled = styled.div `
    position: fixed;
    background-color: #ced922;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center; 
    justify-content: center;
    bottom: 3%;
    right: 8%;
    color: white;
    transition: all 300ms ease;
    box-shadow: 0px 7px 20px -10px #0000007d;
    cursor: pointer;
 
    &:hover {
        transform: ${({ hover }) => hover ? 'scale(1.2)' : 'none'};
    };

    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        width: 50px;
        height: 50px;
        border-radius: 50px;
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
