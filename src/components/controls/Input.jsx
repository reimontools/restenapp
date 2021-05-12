import styled from "styled-components";

const DivInputStyled = styled.div `
    margin: 10px 0 10px 0;
    width: 100%;
    color: #222;
    label {
        position: absolute;
            top: -10px;
        font-weight: 600;
        padding: 3px;
        cursor: pointer; 
    };
    input {
        width: 100%;
        background: #fff;
        border: 3px solid transparent;
        border-radius: 5px;
        height: 45px;
        line-height: 45px;
        padding: 0 10px 0 10px;
        transition: .3s ease all;
        outline: none;
        border: 2px solid #0e70b8;
        &:focus {
            box-shadow: 3px 0px 30px rgba(163, 163, 163, 0.4)
        };
    };
    p {
        font-size: 10px;
        font-weight: 600;
        font-style: oblique;
        color: #bb3345;
        text-align: right;
        padding-top: 1px;
        padding-right: 5px;
    };
`;

const Input = {
    Basic: ({label, action, ...inputTextProps}) => {
        return (
            <DivInputStyled>
                {label && <label>{label}</label>}
                <input 
                    type="text"
                    autoComplete="off"
                    {...inputTextProps}
                    onChange={e => action(e)}
                />
            </DivInputStyled>
        );
    },
    TextAction: ({label, action, ...inputTextProps}) => {
        return (
            <DivInputStyled>
                {label && <label>{label}</label>}
                <input 
                    type="text"
                    autoComplete="off"
                    {...inputTextProps}
                    onChange={e => action(e.target.value)}
                />
            </DivInputStyled>
        );
    },
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

    DateValidation: ({register, label, error, ...inputTextProps}) => {
        return (
            <DivInputStyled>
                {label && <label>{label}</label>}
                <input 
                    type="date"
                    {...inputTextProps}
                    ref={register}
                />
                {error && <p>{error.message}</p>}
            </DivInputStyled>
        );
    }
};

export default Input;