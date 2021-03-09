import styled from "styled-components";

const FormStyled = styled.div `
    width: auto;
    div.head-container {
        font-family: sundayBest;
        font-size: 30px;
        text-align: center;
        color: #999999;
    };
`;

const Form = {
    StyleOne: ({children, ...formTextProps}) => {
        return ( 
            <FormStyled>
                <div className="head-container">{formTextProps.title}</div>
                <div className="body-container">
                    {children}
                </div>
            </FormStyled>
        );
    }
};

export default Form;