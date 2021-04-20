import styled from "styled-components";
import { MEDIUM_SCREEN_SIZE_PX } from "../../helpers/paramHelper";

const ContainerLabelStyled = styled.div `
    display: flex;
    flex-wrap: wrap;
    height: auto;
    font-size: 11px;
    margin: 10px 0 10px 0;
    .item-container {
        width: auto;
        display: flex;
        align-items: center;
        border-radius: 5px;
        padding: 2px;
    }
`;

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
`;

const ContainerBasicStyled = styled.div `
    width: ${({ width }) => width ? width : '100%'};
    padding: 10px;
    /* @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        width: 100%;
    }; */
`;

const ContainerFlex = styled.div `
    display: flex;
    align-items: center;
    justify-content: ${({ flexJustifyContent }) => flexJustifyContent ? flexJustifyContent : 'center'};
    margin: ${({ margin }) => margin ? margin : '0'};
`;

const ContainerOverlay = styled.div `
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    width: 100vw;
    height: 100%;
    bottom: 0;
    background-color: ${({ backgroundColor }) => backgroundColor ? backgroundColor : '#00000000'};
    z-index: 10000;
    overflow: auto;
    transition: all .5s ease-in-out;
    /* @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        align-items: flex-start;
        padding-top: 60px;
    }; */
`;

const ContainerDialog = styled.div `
    width: ${({ width }) => width ? width : '300px'};
    position: relative;
    background: #dddd;
    border-radius: 10px;
    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        width: 90%;
        height: auto;
    };
`;

const ContainerTableStyled = styled.div `
    width: 90%;
`;

const ContainerScoreStyled = styled.div `
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 10px;
    .score {
        cursor: pointer;
        padding: 10px;
        /* margin-right: 10px; */
        /* margin: 0 10px 10px 0; */
        /* width: 250px; */
        min-width: 200px;
        border: solid 2px #0e70b8;
        border-radius: 5px;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: flex-start;
    };
    .player {
        width:100%; 
        display: flex;
        align-items: center;
        justify-content: flex-start;
    };
    .player-name {
        width: 100%;
    };
    .player-score {
        width:100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    };
    .player-points {
        width:100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    };
    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        .score {
            min-width: 100%; 
            /* margin: 0 0 10px 0; */
        };
    };
`;

const ContainerScoreCrudStyled = styled.div `
    width: 100%;
    .score {
        padding: 10px;
        margin: 10px 0 10px 0;
        border: solid 2px #0e70b8;
        border-radius: 5px;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: flex-start;
    };
    .player {
        width:100%; 
        display: flex;
        align-items: center;
        justify-content: flex-start;
    };
    .player-name {
        width: 100%;
    };
    .player-score {
        width:100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    };
    .player-points {
        width:100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    };
    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        .score {
            min-width: 100%; 
            /* margin: 0 0 10px 0; */
        };
    };
`;

const Container = { 
    Basic: ({children, ...props}) => {
        return (
            <ContainerBasicStyled {...props}>
                {children}
            </ContainerBasicStyled>
        );
    },
    Flex: ({children, ...props}) => {
        return (
            <ContainerFlex {...props}>
                {children}
            </ContainerFlex>
        );
    },
    Dialog: ({children, ...props}) => {
        return (
            <ContainerDialog {...props}>
                {children}
            </ContainerDialog>
        );
    },
    Overlay: ({children, ...props}) => {
        return (
            <ContainerOverlay {...props}>
                {children}
            </ContainerOverlay>
        );
    },
    Primary: ({children}) => {
        return (
            <ContainerStyled>
                {children}
            </ContainerStyled>
        );
    },
    Label: ({children}) => {
        return (
            <ContainerLabelStyled>
                {children}
            </ContainerLabelStyled>
        );
    },
    Table: ({children}) => {
        return (
            <ContainerTableStyled>
                {children}
            </ContainerTableStyled>
        );
    },
    Score: ({children}) => {
        return (
            <ContainerScoreStyled>
                {children}
            </ContainerScoreStyled>
        );
    },
    ScoreCrud: ({children}) => {
        return (
            <ContainerScoreCrudStyled>
                {children}
            </ContainerScoreCrudStyled>
        );
    },
};

export default Container;