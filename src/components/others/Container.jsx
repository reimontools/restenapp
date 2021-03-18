import styled from "styled-components";
import { MEDIUM_SCREEN_SIZE_PX } from "../../helpers/paramHelper";

const ContainerStyled = styled.div `
    display: flex;
    flex-direction: column;
    align-items: center; 
    width: 100%;
    .search-container {
        position: relative;
        display: inline;
        display: flex;
        align-items: center; 
        justify-content: space-evenly;
        width: 90%;
    };
    .card-container {
        padding-top: 15px;
        display: flex;
        align-items: center; 
        justify-content: flex-start;
        width: 90%;
    };
    .card {
        width: 150px;
        height: auto;
        /* border: 3px solid #ced922; */
        margin-right: 20px;
        background-color: #d1ebf7;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        align-items: center; 
        justify-content: space-between;
        cursor: pointer;
        &:hover {
            background-color: #5ab9ff;
        };
    };
    .text-container {
        width: 100%;
        height: 100%;
        text-align: center;
        padding: 5px;
        word-wrap: break-word;
    };
    .icon-container {
        width: 100%;
        padding: 5px 5px 5px 65%;
        display: flex;
        align-items: center; 
        justify-content: space-between;
    };
    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        .card-container {
            flex-direction: column;
        };
        .card {
            width: 100%;
            margin: 0 0 10px 0;
        };
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