import styled from "styled-components";
import { MEDIUM_SCREEN_SIZE_PX, getImageByFamily, getIconByFamily } from "../../helpers/parameters.helper";

const ContainerStyled = styled.div `
    display: none;
    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
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

const Image = {
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

export default Image;