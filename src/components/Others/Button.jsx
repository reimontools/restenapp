import styled from "styled-components";

const ButtonStyled = styled.button `
    height: 45px;
    line-height: 45px;
    width: 100%;
    background: #0e70b8;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    transition: .1s ease all;
    margin: 10px 0 10px 0;
    &:hover {
        outline: none;
        box-shadow: 3px 0px 30px rgba(163, 163, 163, 1)
    }
`;

const Button = {
    StyledOne: ({action, ...buttonProps}) => {
        return (
            <ButtonStyled 
                type="button"
                onClick={action}
                {...buttonProps}
            />
        );
    }
};

export default Button;