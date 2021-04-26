import styled from "styled-components";
import { MEDIUM_SCREEN_SIZE_PX } from "../../helpers/paramHelper";

const ContainerStyled = styled.div `
    width: 100%;
`;

const ScoreStyled = styled.div `
    padding: 10px;
    margin: 10px 0 10px 0;
    border: solid 2px #0e70b8;
    border-radius: 5px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: flex-start;
    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        min-width: 100%; 
    };
`;

const PlayerStyled = styled.div `
    width:100%; 
    height: 25px; 
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;

const PlayerNameStyled = styled.div `
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    font-weight: ${({ weight }) => weight ? weight : '400'};
`;

const PlayerScoreStyled = styled.div `
    width:100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: ${({ weight }) => weight ? weight : '400'};
`;

const PlayerPointStyled = styled.div `
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: ${({ pointer }) => pointer ? 'pointer' : 'auto'};
    width:100%;
    height: 100%;
    border-radius: 100px;
    &:hover {
        background-color: ${({ hover }) => hover ? '#86a8c545' : 'none'};
    }
`;

const ContainerScoreCrud = { 
    Container: ({children, ...props}) => {
        return (
            <ContainerStyled {...props}>
                {children}
            </ContainerStyled>
        );
    },
    Score: ({children, ...props}) => {
        return (
            <ScoreStyled {...props}>
                {children}
            </ScoreStyled>
        );
    },
    Player: ({children, ...props}) => {
        return (
            <PlayerStyled {...props}>
                {children}
            </PlayerStyled>
        );
    },
    PlayerName: ({children, ...props}) => {
        return (
            <PlayerNameStyled {...props}>
                {children}
            </PlayerNameStyled>
        );
    },
    PlayerScore: ({children, ...props}) => {
        return (
            <PlayerScoreStyled {...props}>
                {children}
            </PlayerScoreStyled>
        );
    },
    PlayerPoint: ({children, ...props}) => {
        return (
            <PlayerPointStyled {...props}>
                {children}
            </PlayerPointStyled>
        );
    }
};

export default ContainerScoreCrud;