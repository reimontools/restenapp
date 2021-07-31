import styled from "styled-components";

// CONTAINERS ####################################################################################################################################### 
export const ContainerChampionships = styled.div `
    margin-bottom: 10px; 
`;

export const ContainerChampionship = styled.div `
    display: flex;
    flex-direction: column;
    margin: 10px 0 10px 0;
`;

export const ContainerChampionshipHeader = styled.div `
    display: flex;
    align-items: center; 
    justify-content: start;
    cursor: pointer;
    width: auto;
    margin-bottom: 5px;
`;

export const ContainerScores = styled.div `
    overflow: hidden;
    transition: max-height 0.7s;
    &.show {
        max-height: 100em;
    };
    &.hide {
        max-height: 0;
    };
`;