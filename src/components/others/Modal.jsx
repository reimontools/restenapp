import ReactDOM from "react-dom";
import styled from "styled-components";
import { ButtonIcon} from "../../component";
import { MEDIUM_SCREEN_SIZE_PX } from "../../helpers/paramHelper";

const ModalStyled = styled.div `
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
        width: 100vw;
        height: 100vh;
        bottom: 100%;
    
    z-index: 10000;
    transition: all .5s ease-in-out;
    
    &.open {
        display: flex;
        bottom: 0;
    };
    
    &.form {
        background-color: rgb(0, 0, 0, .85);
    };

    .dialog {
        width: 500px;
        position: relative;
        background: #dddd;
        border-radius: 5px;
    };

    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        .dialog {
            width: 90%;
        };
    };
`;

const Modal = {
    ForForm: ({isOpen, closeModal, children}) => {
        return ReactDOM.createPortal(
            <ModalStyled className={isOpen && 'open form'}>
                <div className="dialog ">
                    <ButtonIcon.Close action={closeModal}/>
                    {children}
                </div>
            </ModalStyled>, document.getElementById("root-modal")
        );
    },
    ForMessage: ({isOpen, closeModal, children}) => {
        return ReactDOM.createPortal(
            <ModalStyled className={isOpen && 'open'}>
                <div className="dialog">
                    <ButtonIcon.Close action={closeModal}/>
                    {children}
                </div>
            </ModalStyled>, document.getElementById("root-modal")
        );
    }
};

export default Modal;

