import styled from "styled-components";

const TitleBasicStyled = styled.div `
    font-family: sundayBest;
    font-size: ${({ fontSize }) => fontSize ? fontSize : '15px'};
    display: flex;
    align-items: center; 
    justify-content: center;
    width: 100%;
    /* font-size: 15px; */
    color: rgb(55, 55, 55);
    font-weight: 700;
    text-align: left;
    margin: ${({ margin }) => margin ? margin : '0'};
`;

const Title = {
    Basic: ({children, ...props}) => {
        return ( 
            <TitleBasicStyled {...props}>
                {children}
            </TitleBasicStyled>
        );
    }
};

export default Title;