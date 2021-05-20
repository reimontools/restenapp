import { MEDIUM_SCREEN_SIZE_PX } from "../../helpers/paramHelper";
import styled from "styled-components";
// import { Icon } from "../../component";

const IconTextStyled = styled.div `
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0 10px 0;
    /* &:hover {
        background-color: #aaa6a6dd;
    };

    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        &:hover {
            transform: none;
        };
    }; */
`;

const TextStyled = styled.div `
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
`;

// const IconStyled = styled.div `
//     display: flex;
//     justify-content: center;
//     align-items: center;
// `;

const IconText = {
    Basic: ({children, ...iconProps}) => {
        return (
            <IconTextStyled {...iconProps}> 

                {/* <IconStyled>
                    <Icon.Basic family={iconProps.family} />
                </IconStyled> */}
                
                <TextStyled>
                    {children}
                </TextStyled>

            </IconTextStyled>
        );
    }
};

export default IconText;

