import ReactDOM from "react-dom";
import styled from "styled-components";
import { Icon } from "../component.controls";
import { MEDIUM_SCREEN_SIZE_PX } from "../../helpers/parameters.helper";

const ModalStyled = styled.div `
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    width: 100vw;
    height: 100%;
    bottom: 100%;
    z-index: ${({ zindex }) => zindex ? zindex : 10000};
    transition: all .5s ease-in-out;
    overflow: auto;
    
    &.open {
        bottom: 0;
    };
    
    &.form {
        background-color: #000000d9;
    };

    .dialog {
        width: 500px;
        position: relative;
        background: #fff;
        border-radius: 5px;
    };

    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        align-items: flex-start;
        padding-top: 60px;
        .dialog {
            width: 90%;
            height: auto;
        };
    };
`;

const ModalNew = {
    ForForm: ({isOpen, closeModal, children, ...props}) => {
        return ReactDOM.createPortal(
            <ModalStyled className={isOpen && 'open form'} {...props}>
                <div className="dialog ">
                    <Icon.Basic family="close" onClick={closeModal} hover right="10px" top="10px" size="20px"/>
                    {children}
                </div>
            </ModalStyled>, document.getElementById("root-modal")
        );
    }
};

export default ModalNew;

