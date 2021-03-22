import styled from "styled-components";

const DivSelectStyled = styled.div `
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
    select {
        -webkit-appearance: none;
        width: 100%;
        background: #fff;
        border: 3px solid transparent;
        border-radius: 5px;
        height: 45px;
        padding: 0 40px 0 10px;
        transition: .3s ease all;
        border: 3px solid #0e70b8;
        outline: none;
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

const Select = {
    Basic: ({label, content, action, ...inputTextProps}) => {
        return (
            <DivSelectStyled>
                {label && <label>{label}</label>}
                <select 
                    onChange={e => action(e)}
                    {...inputTextProps}>
                        {content.map(e => (<option key={e[Object.keys(e)[0]]} value={e[Object.keys(e)[0]]}>{e[Object.keys(e)[1]]}</option>))}
                </select>
            </DivSelectStyled>
        );
    },
    TextValidation: ({register, label, error, content, ...inputTextProps}) => {
        return (
            <DivSelectStyled>
                {label && <label>{label}</label>}
                <select 
                    ref={register}
                    {...inputTextProps}>
                        {content.map(e => (<option key={e[Object.keys(e)[0]]} value={e[Object.keys(e)[0]]}>{e[Object.keys(e)[1]]}</option>))}
                        {/* <option hidden value="">Select one...</option> */}
                </select>
                {error && <p>{error.message}</p>}
            </DivSelectStyled>
        );
    },
    OnChange: ({register, label, content, action, ...inputTextProps}) => {
        return (
            <DivSelectStyled>
                {label && <label>{label}</label>}
                <select 
                    ref={register}
                    onChange={e => action(e.target.value)}
                    {...inputTextProps}>
                        {content.map(e => (<option key={e[Object.keys(e)[0]]} value={e[Object.keys(e)[0]]}>{e[Object.keys(e)[1]]}</option>))}
                </select>
            </DivSelectStyled>
        );
    }
};

export default Select;