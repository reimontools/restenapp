import styled from "styled-components";

const StarStyled = styled.span ` 
    color: #FFD90F;
    margin: ${({ margin }) => margin ? margin : '0'};
    &:before {
        content: "★";
    };
`;

const PointStyled = styled.span ` 
    color: #0e70b8;
    margin: ${({ margin }) => margin ? margin : '0'};
    &:before {
        content: "●";
    };
`;

const CheckStyled = styled.span ` 
    color: #008000;
    margin: ${({ margin }) => margin ? margin : '0'};
    &:before {
        content: "✔";
    };
`;


const Simbol = {
    Star: ({...props}) => {
        return ( 
            <StarStyled {...props}/>
        );
    },
    Point: ({...props}) => {
        return ( 
            <PointStyled {...props}/>
        );
    },
    Check: ({...props}) => {
        return ( 
            <CheckStyled {...props}/>
        );
    }
};

export default Simbol;