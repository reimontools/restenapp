import styled from "styled-components";

const TitleBasicStyled = styled.div `
    /* position: relative; */
    font-family: sundayBest;
    font-size: ${({ fontSize }) => fontSize ? fontSize : '15px'};
    display: flex;
    align-items: center; 
    justify-content: ${({ flexJustifyContent }) => flexJustifyContent ? flexJustifyContent : 'center'};
    width: 100%;
    color: rgb(55, 55, 55);
    font-weight: 700;
    text-align: left;
    margin: ${({ margin }) => margin ? margin : '0'};
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