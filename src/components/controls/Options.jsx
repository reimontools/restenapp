import ReactDOM from "react-dom";
import { Container } from "../../component";

const Options = {
    Basic: ({ isOpen, close, children  }) => {

        const handleWea = e => {
            e.stopPropagation();
            console.log("weaita");
        };

        if (!isOpen) return null;
        return ReactDOM.createPortal(
            <Container.Overlay className="weaita" onClick={close}>
                <Container.Dialog onClick={e => handleWea(e)}>
                    <Container.Basic>
                        {/* <Container.Flex flexJustifyContent="flex-start" margin="5px 0 15px 0">Options</Container.Flex> */}
                        {children}
                    </Container.Basic>
                </Container.Dialog>
            </Container.Overlay>, document.getElementById("root-modal")
        );
    },
};

export default Options;