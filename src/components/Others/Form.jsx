import styled from "styled-components";

const FormStyled = styled.div `
    width: 350px;
    padding: 10px;
    div.head-container {
        width: 100%;
        font-size: 25px;
        font-weight: 700;
        /* text-align: center; */
        /* padding: 0; */
    };
    div.body-container {
        width: 100%;
        /* padding: 0; */
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