import styled from "styled-components";

const ContainerStyled = styled.div `
    display: flex;
    flex-direction: column;
    align-items: center; 
    width: 100%;
    .search-container {
        position: relative;
        display: flex;
        align-items: center; 
        justify-content: space-evenly;
        width: 90%;
    };
`;

const Container = {
    Primary: ({children}) => {
        return (
            <ContainerStyled>
                {children}
            </ContainerStyled>
        );
    }
};

export default Container;