import styled from "styled-components";

const DivSelectStyled = styled.div `
    margin: 10px 0 10px 0;
    width: 100%;
    color: #222;
    label {
        display: block;
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
    TextValidation: ({register, label, error, content, ...inputTextProps}) => {
        return (
            <DivSelectStyled>
                {label && <label>{label}</label>}
                <select 
                    type="text"
                    autoComplete="off"
                    {...inputTextProps}
                    ref={register}>
                        {/* <option hidden value="">Select one...</option> */}
                        {/* {content.map(e => (<option key={e.user_type_id} value={e.user_type_id}>{e.name}</option>))} */}
                        {content.map(e => (<option key={e[Object.keys(e)[0]]} value={e[Object.keys(e)[0]]}>{e[Object.keys(e)[1]]}</option>))}
                </select>
                {error && <p>{error.message}</p>}
            </DivSelectStyled>
        );
    },
    OnChange: ({register, label, content, action, ...inputTextProps}) => {
        return (
            <>
                {/* {label && <label>{label}</label>} */}
                <DivSelectStyled>
                    <select 
                        ref={register}
                        onChange={e => action(e.target.value)}
                        {...inputTextProps}>
                            {content.map(e => (<option key={e[Object.keys(e)[0]]} value={e[Object.keys(e)[0]]}>{e[Object.keys(e)[1]]}</option>))}
                    </select>
                </DivSelectStyled>
            </>
        );
    }
};

export default Select;