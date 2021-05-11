import styled from "styled-components";
import { MEDIUM_SCREEN_SIZE_PX } from "../../helpers/paramHelper";

const ContainerScoreStyled = styled.div `
    cursor: pointer;
    padding: 10px;
    min-width: 200px;
    border: solid 2px;
    border-color: ${({ color }) => color ? color : '#0e70b8'};
    border-radius: 5px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: flex-start;
    transition: all .2s ease;
    .player {
        width:100%; 
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 0 5px 0 5px;
    };
    .match-state {
        width: 100%;
        font-weight: 600;
        margin-bottom: 10px;
        color: ${({ color }) => color ? color : '#0e70b8'};
        text-align: right;
        padding-right: 5px;
    };
    .player-name {
        width: 100%;
    };
    .winner {
        color: green;
        font-weight: 600;
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
        justify-content: flex-end;
    };
    &:hover {
        background-color: ${({ color }) => color === "#0e70b8" ? "#c8e1f3" : "#bbe4bb"};
        transform: scale(1.05);
    };
    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        min-width: 100%; 
        background-color: ${({ color }) => color === "#0e70b8" ? "#c8e1f3" : "#bbe4bb"};
        &:hover {
            transform: none;
        };
    };
`;

const ContainerScore = { 
    Container: ({children, ...props}) => {
        return (
            <ContainerScoreStyled {...props}>
                {children}
            </ContainerScoreStyled>
        );
    }
};

export default ContainerScore;