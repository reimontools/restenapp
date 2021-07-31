import styled from "styled-components";

const Container = styled.div `
    display: flex;
    justify-content: flex-start;
    height: auto;
    margin: 15px 10px 15px 10px;
    font-size: 14px;
`;

const Message = ({...props}) => {
    return (
        <Container>
            {props.text}
        </Container>
    );
};

export default Message;