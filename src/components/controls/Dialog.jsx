import ReactDOM from "react-dom";
import { Container, Title, Button } from "../component.controls";

const Dialog = {
    Action: ({ options, close  }) => {

        // HANDLE #######################################################################################################################################
        const handleAction = action => {
            action();
            close()
        };

        // RENDERS ######################################################################################################################################
        const renderDialog = ({title, text, subtext, family = 'info', action}) => {
            return (
                <Container.Overlay>
                    <Container.Dialog>
                        <Container.Basic>
                            <Title.Basic flexJustifyContent="flex-start">{title}</Title.Basic>
                            <Container.Flex flexJustifyContent="flex-start" margin="5px 0 15px 0">{text}</Container.Flex>
                            {subtext && <Container.Flex flexJustifyContent="flex-start" margin="0 0 15px 0" fontSize="12px" black>{subtext}</Container.Flex>}
                            {renderButtons(family, action)}
                        </Container.Basic>
                    </Container.Dialog>
                </Container.Overlay>
            );
        };

        const renderButtons = (family, action) => {
            if (family === "delete") { 
                return (
                    <Container.Flex flexJustifyContent="space-around">
                        <Button.Basic onClick={() => close()} family="close" height="auto" fit>Cancel</Button.Basic>
                        <Button.Basic onClick={() => handleAction(action)} family="delete" height="auto" fit>Yes, delete it</Button.Basic>
                    </Container.Flex>
                );
            }; 

            if (family === "question") { 
                return (
                    <Container.Flex flexJustifyContent="space-around">
                        <Button.Basic onClick={() => close()} family="close" height="auto" fit>Cancel</Button.Basic>
                        <Button.Basic onClick={() => handleAction(action)} family="delete" height="auto" fit>Yes, do it</Button.Basic>
                    </Container.Flex>
                );
            };

            return (
                <Container.Flex flexJustifyContent="flex-end">
                    <Button.Basic onClick={() => close()} family="ok" height="auto" >Ok</Button.Basic>
                </Container.Flex> 
            );
        };

        if (!options?.title) return null;
        return ReactDOM.createPortal(renderDialog(options), document.getElementById("root-modal"));
    }
};

export default Dialog;