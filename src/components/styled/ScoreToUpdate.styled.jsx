import styled from "styled-components";
import { MEDIUM_SCREEN_SIZE_PX } from "../../helpers/parameters.helper";

export const ContainerScoreToUpdate = styled.div `
    width: 100%;
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

export const ContainerPlayer = styled.div `
    width:100%; 
    height: 25px; 
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;

export const ContainerPlayerName = styled.div `
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    font-weight: ${({ weight }) => weight ? weight : '400'};
`;

export const ContainerPlayerScore = styled.div `
    width:100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: ${({ weight }) => weight ? weight : '400'};
`;

export const ContainerPlayerPoint = styled.div `
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: ${({ pointer }) => pointer ? 'pointer' : 'auto'};
    width:100%;
    height: 100%;
    border-radius: 100px;
    &:hover {
        background-color: ${({ hover }) => hover ? '#86a8c545' : 'none'};
    };
`;

// const ContainerScoreStyled = styled.div `
//     cursor: pointer;
//     padding: 10px;
//     margin-bottom: 10px;
//     min-width: 200px;
//     border: solid 2px;
//     border-color: ${({ color }) => color ? color : '#0e70b8'};
//     border-radius: 5px;
//     display: flex;
//     align-items: center;
//     flex-direction: column;
//     justify-content: flex-start;
//     transition: all .2s ease;
//     &:hover {
//         background-color: ${({ color }) => color === "#0e70b8" ? "#c8e1f3" : "#bbe4bb"};
//     };
//     @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
//         min-width: 100%; 
//         background-color: ${({ color }) => color === "#0e70b8" ? "#c8e1f3" : "#bbe4bb"};
//         &:hover {
//             transform: none;
//         };
//     };
// `;

// export const ContainerScore = ({children, ...props}) => {
//     return (
//         <ContainerScoreStyled {...props}>
//             {children}
//         </ContainerScoreStyled>
//     );
// };