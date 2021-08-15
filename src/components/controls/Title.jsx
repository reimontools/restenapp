import styled from "styled-components";
import { MEDIUM_SCREEN_SIZE_PX } from "../../helpers/parameters.helper";

const TitleBasicStyled = styled.div `
    /* position: relative; */
    font-family: sundayBest;
    font-size: ${({ fontSize }) => fontSize ? fontSize : '15px'};
    display: flex;
    align-items: center; 
    justify-content: ${({ flexJustifyContent }) => flexJustifyContent ? flexJustifyContent : 'center'};
    width: ${({ width }) => width ? width : '100%'};
    color: rgb(55, 55, 55);
    font-weight: 700;
    margin: ${({ margin }) => margin ? margin : '0'};
    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        font-size: 12px;
        width: 90%;
    };
`;

const Title = {
    Basic: ({children, ...titleProps}) => {
        return ( 
            <TitleBasicStyled {...titleProps}>
                {children}
            </TitleBasicStyled>
        );
    }
};

export default Title;