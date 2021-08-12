import styled from "styled-components";
import { getImageByFamily, getIconByFamily } from "../../helpers/parameters.helper";

const ContainerStyled = styled.div `
    position: relative;
    display: flex;
    align-items: center; 
    justify-content: center;
    margin-right: 5px;
    width: 30px;
    height: 30px;
    img {
        height: 30px;
    };
`;

const ButtonDeleteStyled = styled.div `
    position: absolute;
    bottom: -1px;
    right: -1px;
    background-color: grey;
    width: 12px;
    height: 12px;
    border-radius: 12px;
    display: flex;
    align-items: center; 
    justify-content: center;
    color: white;
    font-size: 10px;
    cursor: pointer;
`;

const Image = {
    Basic: ({...props}) => {
        return ( 
            <ContainerStyled {...props}>
                <img src={getImageByFamily(props.family)} alt={props.family} />
            </ContainerStyled>
        );
    },
    BasicDelete: ({...props}) => { 
        return ( 
            <ContainerStyled {...props}>
                <img src={getImageByFamily(props.family)} alt={props.family} />
                <ButtonDeleteStyled>
                    {getIconByFamily("close")}
                </ButtonDeleteStyled>
            </ContainerStyled>
        );
    }
};

export default Image;