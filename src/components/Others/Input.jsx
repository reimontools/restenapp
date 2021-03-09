import styled from "styled-components";

const DivInputStyled = styled.div `
    input {
        font-family: sundayBest;
        font-size: 10px;
        width: 100%;
        height: 65px;
        outline: none;
        border:0;
        border-bottom: solid 2px #ccc;
        &:hover {
            border-bottom: solid 2px rgb(186, 218, 85);
        };
        &:focus {
            border-bottom: solid 2px #333c87;
        };
    };
    div.alert-message {
        font-family: sundayBest;
        font-size: 8px;
        height: 22px;
        color: #bb3345;
        text-align: right;
    }
`;

const Input = {
    Text: ({register, error, ...inputTextProps}) => {
        return (
            <DivInputStyled>
                <input 
                    type="text"
                    autoComplete="off"
                    {...inputTextProps}
                    ref={register}
                />
                {error ? <div className="alert-message">{error.message}</div> : <div></div>}
            </DivInputStyled>
        );
    }
};

export default Input;