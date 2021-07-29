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
        outline: none;
        border: 2px solid #0e70b8;
        &:focus {
            box-shadow: 3px 0px 30px rgba(163, 163, 163, 0.4)
        };
        &.disable {
            pointer-events: none;
            border: 2px solid #D3D3D3;
            color: #D3D3D3;
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
    Validation: ({register, ...props}) => {
        return (
            <DivSelectStyled>
                <select name={props.name} ref={register} className={props.disable ? "disable" : ""}>
                    {props.text && <option hidden value="">{props.text}</option>}
                    {props.content.map(e => (<option key={e[Object.keys(e)[0]]} value={e[Object.keys(e)[0]]}>{e[Object.keys(e)[1]]}</option>))}
                </select>
                {props.error && <p>{props.error.message}</p>}
            </DivSelectStyled>
        );
    },
    Filter: ({text, content, action, ...props}) => {
        return (
            <DivSelectStyled>
                <select name={props.name} onChange={e => action(e)}>
                    {text && <option value="">{text}</option>}
                    {content.map(e => (<option key={e[Object.keys(e)[0]]} value={e[Object.keys(e)[0]]}>{e[Object.keys(e)[1]]}</option>))}
                </select>
            </DivSelectStyled>
        );
    },
    Basic: ({text, content, action, ...props}) => {
        return (
            <DivSelectStyled>
                <select name={props.name} onChange={e => action(e)}>
                    {text && <option hidden value="">{text}</option>}
                    {content.map(e => (<option key={e[Object.keys(e)[0]]} value={e[Object.keys(e)[0]]}>{e[Object.keys(e)[1]]}</option>))}
                </select>
            </DivSelectStyled>
        );
    },
    OnChange: ({register, label, content, action, ...Props}) => {
        return (
            <DivSelectStyled>
                {label && <label>{label}</label>}
                <select
                    ref={register}
                    onChange={e => action(e.target.value)}
                    {...Props}>
                        {content.map(e => (<option key={e[Object.keys(e)[0]]} value={e[Object.keys(e)[0]]}>{e[Object.keys(e)[1]]}</option>))}
                </select>
            </DivSelectStyled>
        );
    }
};

export default Select;