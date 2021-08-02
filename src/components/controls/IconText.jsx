// import { MEDIUM_SCREEN_SIZE_PX } from "../../helpers/parameters.helper";
import styled from "styled-components";
import { Icon } from "../../component.controls";

const IconTextStyled = styled.div `
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0 10px 0;
    &:hover {
        color: black;
    };
`;

const TextStyled = styled.div `
    display: flex;
    justify-content: flex-start;
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

                <Icon.Naked family={iconProps.family} color={"white"} margin="0 5px 0 0" />
                
                
                <TextStyled>
                    {children}
                </TextStyled>

            </IconTextStyled>
        );
    }
};

export default IconText;

