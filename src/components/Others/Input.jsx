import styled from "styled-components";

const DivInputStyled = styled.div `
    margin: 10px 0 10px 0;
    width: 100%;
    color: #222;
    label {
        display: block;
        font-weight: 600;
        padding: 3px;
        cursor: pointer; 
    }
    input {
        width: 100%;
        background: #fff;
        border: 3px solid transparent;
        border-radius: 3px;
        height: 45px;
        line-height: 45px;
        padding: 0 40px 0 10px;
        transition: .3s ease all;
        &:focus {
            border: 3px solid #0e70b8;;
            outline: none;
            box-shadow: 3px 0px 30px rgba(163, 163, 163, 0.4)
        }
    };
    p {
        font-size: 10px;
        font-weight: 600;
        font-style: oblique;
        color: #bb3345;
        text-align: right;
        padding-top: 1px;
        padding-right: 5px;
    }
`;

const Input = {
    TextValidation: ({register, label, error, ...inputTextProps}) => {
        return (
            <DivInputStyled>
                {label && <label>{label}</label>}
                <input 
                    type="text"
                    autoComplete="off"
                    {...inputTextProps}
                    ref={register}
                />
                {error && <p>{error.message}</p>}
            </DivInputStyled>
        );
    },

    TextAction: ({action, ...inputTextProps}) => {
        return (
            <DivInputStyled>
                <input 
                    type="text"
                    autoComplete="off"
                    {...inputTextProps}
                    onChange={e => action(e.target.value)}
                />
            </DivInputStyled>
        );
    }
};

export default Input;