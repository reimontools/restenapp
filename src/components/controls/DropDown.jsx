import styled from "styled-components";
import { Icon } from "../../component";

const DropDownStyled = styled.div `
    position: relative;
`;

// const DropDownMenuStyled = styled.div `
//     position: absolute;
//     top: -5px;
//     right: 30px;
//     width: 150px;
//     /* border: 1px solid red; */
//     background-color: #0e70b8;
//     box-sizing: 0 5px 25px rgba(0, 0, 0, 0.1);
//     border-radius: 15px;
//     transition: 0.5s;

//     visibility: hidden;
//     opacity: 0;

//     &:before {
//         content: '';
//         position: absolute;
//         top: 13px;
//         right: -2px;
//         width: 15px;
//         height: 15px;
//         background: #0e70b8;
//         transform: rotate(45deg);
//     };
// `;

const DropDownIconStyled = styled.div `

    position: relative;

    &:hover .menu {
        visibility: visible;
        opacity: 1;
    };

    .menu {
        position: absolute;
        top: -5px;
        right: 30px;
        width: 150px;
        background-color: #0e70b8;
        box-sizing: 0 5px 25px rgba(0, 0, 0, 0.1);
        border-radius: 15px;
        transition: 0.5s;

        visibility: hidden;
        opacity: 0;

        &:before {
            content: '';
            position: absolute;
            top: 13px;
            right: -2px;
            width: 15px;
            height: 15px;
            background: #0e70b8;
            transform: rotate(45deg);
        };
    };
`;

const DropDown = {
    Basic: ({children, ...dropDownProps}) => {
        return ( 
            <DropDownStyled {...dropDownProps}>

                <DropDownIconStyled>
                    <Icon.Basic size="30px" family="more" onClick={e => e.stopPropagation()}/>
                    <div className="menu">
                        {children}
                    </div>
                </DropDownIconStyled>

            </DropDownStyled>
        );
    }
};

export default DropDown;