import styled from "styled-components";
import { MEDIUM_SCREEN_SIZE_PX } from "../../helpers/parameters.helper";

export const ContainerPlayerScore = styled.div `
    width:100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const ContainerPlayerPoints = styled.div `
    width:100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

export const ContainerPlayer = styled.div `
    width:100%; 
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 5px 0 5px;
`;

export const ContainerPlayerName = styled.div `
    width: 100%;
`;

export const ContainerScoreHeader = styled.div `
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    font-weight: 600;
    margin-bottom: 10px;
    color: ${({ color }) => color ? color : '#0e70b8'};
    padding: 0 5px 0 5px;
`;

export const ContainerMatchState = styled.div `
`;

export const ContainerMatchGroupName = styled.div `
`;

const getSecundaryColorByPrimaryColor = primaryColor => {
    if (primaryColor === "#008000") return "#BBE4BB"; // FINISH  
    if (primaryColor === "#0E70B8") return "#C8E1F3"; // PENDING
    if (primaryColor === "#FFD90F") return "#FFF7CD"; // WAITING
};

const ContainerScoreStyled = styled.div `
    cursor: pointer;
    padding: 10px;
    margin-bottom: 10px;
    min-width: 200px;
    border: solid 2px;
    border-color: ${({ color }) => color ? color : '#0e70b8'};
    border-radius: 5px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: flex-start;
    transition: all .2s ease;
    background-color: ${({ color }) => getSecundaryColorByPrimaryColor(color)};
    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        min-width: 100%;
        /* background-color: ${({ color }) => getSecundaryColorByPrimaryColor(color)}; */
        &:hover {
            transform: none;
        };
    };
`;

export const ContainerScore = ({children, ...props}) => {
    return (
        <ContainerScoreStyled {...props}>
            {children}
        </ContainerScoreStyled>
    );
};