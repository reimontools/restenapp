import styled from "styled-components";
import { PRIMARY_COLOR, MEDIUM_SCREEN_SIZE_PX, getColorByFamily, getIconByFamily } from "../../helpers/paramHelper";

const MenuStyled = styled.div `
    z-index: 10000;
    position: absolute;
    bottom: 40px;
    right: 70px;
    width: 200px;
    background-color: ${PRIMARY_COLOR};
    border-radius: 10px;
    transition: 0.5s;
    visibility: hidden;
    opacity: 0;
    padding:5px;
    cursor: pointer;
    &:before {
        z-index: -1;
        content: '';
        position: absolute;
        bottom: 13px;
        right: -4px;
        width: 15px;
        height: 15px;
        background: ${PRIMARY_COLOR};
        transform: rotate(45deg);
    };
    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        right: 65px;
    };
`;

const ContainerStyled = styled.div `
    position: fixed;
    display: flex;
    align-items: center; 
    justify-content: center;
    bottom: ${({ bottom }) => bottom ? bottom : '10px'};
    right: 1px;
    width: 60px;
    height: 60px;
    transition: all 300ms ease;
    &:hover ${MenuStyled} {
        bottom: 9px;
        visibility: visible;
        opacity: 1;
    };
    .content {
        color: white;
        width: 100%;
        padding: 10px 0 10px 10px;
        &:hover {
            background-color: #0665ab;
        };
    };
`;

const ButtonStyled = styled.div `
    display: flex;
    align-items: center; 
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: 100%;
    background-color: ${({ family }) => getColorByFamily(family)};
    font-size: 25px;
    color: white;
    transition: all 300ms ease;
    box-shadow: 0px 7px 20px -10px #0000007d;
    cursor: pointer;
    &:hover {
        transform: scale(1.2);
    };
    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        &:hover {
            transform: none;
        };
    };
`;

const DropDownButtonFloat = {
    Basic: ({children, ...dropDownProps}) => {
        return ( 
            <ContainerStyled {...dropDownProps}>
                <ButtonStyled>
                    {getIconByFamily(dropDownProps.family)}
                </ButtonStyled>
                <MenuStyled>{children}</MenuStyled>
            </ContainerStyled>
        );
    }
};

export default DropDownButtonFloat;