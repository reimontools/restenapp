import styled from "styled-components";

// CONTAINERS ####################################################################################################################################### 
export const ContainerPlayers = styled.div `
    padding: 0 7px;
`;

export const ContainerPlayer = styled.div `
    display: flex;
    justify-content: flex-start;
    align-items: center; 
    margin-bottom: 7px;
    border-radius: 5px;
    padding: 10px;
    user-select: "none";
    background: ${({ isDragging }) => isDragging ? "#e6fceb" : "#ebecf0"};
    border: ${({ isDragging }) => isDragging ? "2px solid #091e42b5" : "none"};
`;
