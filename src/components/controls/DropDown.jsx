import styled from "styled-components";
import { Icon } from "../../component";
import {PRIMARY_COLOR } from "../../helpers/paramHelper";

const DropDownIconStyled = styled.div `
    position: relative;
    .menu {
        z-index: 10000;
        position: absolute;
        top: 5px;
        right: 30px;
        width: 150px;
        background-color: ${PRIMARY_COLOR};
        color: white;
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
            background: ${PRIMARY_COLOR};
            transform: rotate(45deg);
        };
    };

    &:hover .menu {
        top: -5px;
        visibility: visible;
        opacity: 1;
    };
`;

const DropDown = {
    Basic: ({children, ...dropDownProps}) => {
        return ( 
            <DropDownIconStyled {...dropDownProps}>
                <Icon.Basic size="30px" family="more" onClick={e => e.stopPropagation()}/>
                <div className="menu">{children}</div>
            </DropDownIconStyled>
        );
    }
};

export default DropDown;