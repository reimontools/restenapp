import { Container, Title } from "../component.controls";

export default function Home() {
    const renderTitle = () => {
        return <Title.Basic flexJustifyContent="flex-start" margin="13px 0 7px 0" width="90%">Home</Title.Basic>;
    };
    return (
        <Container.Primary>
            {renderTitle()}
        </Container.Primary>
    );
};