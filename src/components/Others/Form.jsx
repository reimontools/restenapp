import styled from "styled-components";

const FormStyled = styled.div `
    width: 300px;
    div.head-container {
        font-size: 25px;
        font-weight: 700;
        text-align: center;
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