import ReactDOM from "react-dom";
import styled from "styled-components";
import { ButtonIcon} from "../../component";
import { MEDIUM_SCREEN_SIZE_PX } from "../../helpers/paramHelper";

const Container = styled.div `
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgb(0, 0, 0, .85);
    z-index: 10000;
    
    display: flex;
    bottom: 100%;
    transition: all .5s ease-in-out;

    justify-content: center;
    align-items: center;
    /* transition: all .5s ease; */
    .dialog {
        width: 500px;
        position: relative;
        background: #dddd;
        border-radius: 3px;
    };
    &.open {
        display: flex;
        bottom: 0;
    };
    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
        .dialog {
            width: 90%;
        }
    };
`;

const Modal = ({isOpen, closeModal, children}) => {
    return ReactDOM.createPortal(
        <Container className={isOpen && 'open'}>
            <div className="dialog">
                <ButtonIcon.Close action={closeModal}/>
                {children}
            </div>
        </Container>, document.getElementById("root-modal")
    );
};

export default Modal;