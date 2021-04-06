import styled from "styled-components";

const TitleBasicStyled = styled.div `
    /* position: relative; */
    display: flex;
    align-items: center; 
    justify-content: center;
    width: 100%;
    font-size: 15px;
    color: rgb(55, 55, 55);
    font-family: sundayBest;
    font-weight: 700;
    text-align: left;
    margin: ${({ margin }) => margin ? margin : '0'};
`;

const TitleBasic2Styled = styled.div `
    display: flex;
    flex-direction: column;
    align-items: center; 
`;

const Title = {
    Basic: ({children, ...props}) => {
        return ( 
            <TitleBasicStyled {...props}>
                {children}
            </TitleBasicStyled>
        );
    },
    Basic2: ({children, ...props}) => {
        return ( 
            <TitleBasic2Styled>
                {children}
            </TitleBasic2Styled>
        );
    }
};

export default Title;