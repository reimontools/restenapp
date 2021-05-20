import styled from "styled-components";
import {  getIconByFamily, getColorByFamily, MEDIUM_SCREEN_SIZE_PX } from "../../helpers/paramHelper";

const ButtonUpStyled = styled.div `
    position: fixed;
    background-color: ${({ family }) => getColorByFamily(family)};

    display: flex;
    align-items: center; 
    justify-content: center;
    bottom: ${({ bottom }) => bottom ? bottom : '20px'};
    right: ${({ right }) => right ? right : '20px'};
    width: ${({ size }) => size ? size : '50px'};
    height: ${({ size }) => size ? size : '50px'};
    border-radius: ${({ size }) => size ? size : '50px'};

    color: white;
    transition: all 300ms ease;
    box-shadow: 0px 7px 20px -10px #0000007d;
    cursor: pointer;
 
    &:hover {
        transform: ${({ hover }) => hover ? 'scale(1.2)' : 'none'};
    };

    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        width: ${({ size }) => size ? size : '50px'};
        height: ${({ size }) => size ? size : '50px'};
        border-radius: ${({ size }) => size ? size : '50px'};
        &:hover {
            transform: none;
        };
    };
`;

const ButtonFloat =  {
    Icon: ({...buttonFloatProps}) => {
        return (
            <ButtonUpStyled  {...buttonFloatProps}>
                {getIconByFamily(buttonFloatProps.family)}
            </ButtonUpStyled>
        );
    }
};

export default ButtonFloat;
