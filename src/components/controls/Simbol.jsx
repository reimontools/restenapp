import styled from "styled-components";
import { COLOR_BY_SIMBOL_TYPE, SIMBOLS_BY_SIMBOL_TYPE } from "../../helpers/parameters.helper";

const SpanStyled = styled.span ` 
    color: ${({ type }) => COLOR_BY_SIMBOL_TYPE[type]};
    margin: ${({ margin }) => margin ? margin : '0 0 0 2px'};
`;

const Simbol = ({...props}) => {
    return ( 
        <SpanStyled {...props}>
            {SIMBOLS_BY_SIMBOL_TYPE[props.type]}
        </SpanStyled>
    );
};

export default Simbol