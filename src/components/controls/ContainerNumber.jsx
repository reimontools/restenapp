import styled from "styled-components";
// import { MEDIUM_SCREEN_SIZE_PX } from "../../helpers/paramHelper";

const ContainerStyled = styled.div `
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px 0 10px 0;
    gap: 5px;
`;

const NumberStyled = styled.div `
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    cursor: pointer;
    font-family: sundayBest;
    font-size: ${({ fontSize }) => fontSize ? fontSize : '15px'};
    justify-content: ${({ flexJustifyContent }) => flexJustifyContent ? flexJustifyContent : 'center'};
    color: rgb(55, 55, 55);
`;

const ContainerNumber = { 
    Container: ({children, ...props}) => {
        return (
            <ContainerStyled {...props}>
                {children}
            </ContainerStyled>
        );
    },
    Number: ({children, ...props}) => {
        return (
            <NumberStyled {...props}>
                {children}
            </NumberStyled>
        );
    }
};

export default ContainerNumber;