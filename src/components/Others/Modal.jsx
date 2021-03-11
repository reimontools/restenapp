import ReactDOM from "react-dom";
import styled from "styled-components";
import { ButtonIcon} from "../../component";

const Container = styled.div `
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgb(0, 0, 0, .85);
    z-index: 10000;
    display: none;
    justify-content: center;
    align-items: center;
    transition: all .5s ease;
    .dialog {
        position: relative;
        background: #ddd;
        border-radius: 3px;
    };
    &.open {
        display: grid;
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