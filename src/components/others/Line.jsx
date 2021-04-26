import styled from "styled-components";

const LineBasicStyled = styled.div `
    border-bottom: solid 1px;
    color: ${({ color }) => color ? color : '#0e70b8'};
    margin: 5px 0 5px 0;
    width: 100%;
`;

const Line = {
    Basic: ({...props}) => {
        return ( 
            <LineBasicStyled {...props} />
        );
    }
};

export default Line;