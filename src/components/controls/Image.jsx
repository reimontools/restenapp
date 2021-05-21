import styled from "styled-components";
import { MEDIUM_SCREEN_SIZE_PX } from "../../helpers/paramHelper";
import boy from '../../assets/images/boy.png';
import girl from '../../assets/images/girl.png';

const ImageContainerStyled = styled.div `
    display: none;
    @media screen and (max-width: ${MEDIUM_SCREEN_SIZE_PX}) {
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

const Image = {
    Boy: ({...imageProps}) => {
        return ( 
            <ImageContainerStyled {...imageProps}>
                <img src={boy} alt='boy' />
            </ImageContainerStyled>
        );
    },
    Girl: ({...imageProps}) => {
        return ( 
            <ImageContainerStyled {...imageProps}>
                <img src={girl} alt='girl' />
            </ImageContainerStyled>
        );
    }
};

export default Image;