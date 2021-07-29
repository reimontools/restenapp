import styled from "styled-components";
import { getImageByFamily, getIconByFamily } from "../../helpers/paramHelper";

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
`;


const ImageCircle = {
    Basic: ({...imageProps}) => {
        return ( 
            <ContainerStyled {...imageProps}>
                <img src={getImageByFamily(imageProps.family)} alt={imageProps.family} />
            </ContainerStyled>
        );
    },
    BasicDelete: ({...imageProps}) => { 
        return ( 
            <ContainerStyled {...imageProps}>
                <img src={getImageByFamily(imageProps.family)} alt={imageProps.family} />
                <ButtonDeleteStyled>
                    {getIconByFamily("close")}
                </ButtonDeleteStyled>
            </ContainerStyled>
        );
    }
};

export default ImageCircle;