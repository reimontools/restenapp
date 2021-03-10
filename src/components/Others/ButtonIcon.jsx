import styled from "styled-components";
import { BiEdit, BiTrash } from "react-icons/bi";
import { IoMdPersonAdd } from "react-icons/io";

const DivButtonIconStyled = styled.div `
    width: 20px;
    height: 20px;
    font-size: 20px;
    cursor: pointer;
    &:hover {
        transform: scale(1.5);
        transition: all .2s ease;
    };
    &.update {
        color: #0e70b8;
    };
    &.delete {
        color: #bb3345;
    };
    &.add {
        color: #ced922;
        position: absolute;
        right: 12px;
    };
`;

const ButtonIcon = {
    Update: ({action}) => {
        return (
            <DivButtonIconStyled onClick={action} className="update">
                <BiEdit/>
            </DivButtonIconStyled>
        );
    },
    Delete: ({action}) => {
        return (
            <DivButtonIconStyled onClick={action} className="delete">
                <BiTrash/>
            </DivButtonIconStyled>
        );
    },
    Add: ({action}) => {
        return (
            <DivButtonIconStyled onClick={action} className="add">
                <IoMdPersonAdd/>
            </DivButtonIconStyled>
        );
    },
};

export default ButtonIcon;

