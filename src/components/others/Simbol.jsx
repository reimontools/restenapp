import styled from "styled-components";

const StarStyled = styled.span ` 
    color: #FFD90F;
    &:before {
        content: "★";
    };
`;

const PointStyled = styled.span ` 
    color: #0e70b8;
    &:before {
        content: "●";
    };
`;

const CheckStyled = styled.span ` 
    color: #008000;
    &:before {
        content: "✔";
    };
`;


const Simbol = {
    Star: () => {
        return ( 
            <StarStyled />
        );
    },
    Point: () => {
        return ( 
            <PointStyled />
        );
    },
    Check: () => {
        return ( 
            <CheckStyled />
        );
    }
};

export default Simbol;