import styled from "styled-components";
import { MEDIUM_SCREEN_SIZE_PX, getIconByFamily, PRIMARY_COLOR } from "../../helpers/paramHelper";

const IconAvatarStyled = styled.div `
    display: none;
    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        background-color: ${PRIMARY_COLOR};
        width: 30px;
        height: 30px;
        border-radius: 30px;
        display: flex;
        align-items: center; 
        justify-content: center;
        color: white;
        font-size: 15px;
        margin-right: 5px;
    };
`;

const LetterAvatarStyled = styled.div `
    display: none;
    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        background-color: ${PRIMARY_COLOR};
        width: 30px;
        height: 30px;
        border-radius: 30px;
        display: flex;
        align-items: center; 
        justify-content: center;
        color: white;
        font-size: 18px;
        margin-right: 5px;
    }
`;

const Avatar = {
    Icon: () => {
        return ( 
            <IconAvatarStyled>
                {getIconByFamily("user")}
            </IconAvatarStyled>
        );
    },
    Letter: ({children}) => {
        return ( 
            <LetterAvatarStyled>
                {children}
            </LetterAvatarStyled>
        );
    }
};

export default Avatar;