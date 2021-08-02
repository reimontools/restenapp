import styled from "styled-components";
import { PRIMARY_COLOR, MEDIUM_SCREEN_SIZE_PX, getIconByFamily } from "../../helpers/parameters.helper";

const ButtonStyled = styled.div `
    display: flex;
    align-items: center; 
    justify-content: center;
    width: 33px;
    height: 33px;
    border-radius: 100%;
    font-size: 23px;
    background-color: ${PRIMARY_COLOR};
    color: white;
    margin: ${({ margin }) => margin ? margin : '0'};
    /* transition: all 300ms ease; */
    cursor: pointer;
    /* &:hover {
        color: white;
        transform: scale(1.1);
    }; */
    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        &:hover {
            transform: none;
        };
    };
`;

const ButtonCircleIcon = {
    Basic: ({...props}) => {
        return ( 
            <ButtonStyled {...props}>
                {getIconByFamily(props.family)}
            </ButtonStyled>
        );
    }
};

export default ButtonCircleIcon;