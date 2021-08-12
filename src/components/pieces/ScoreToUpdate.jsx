import { ContainerScoreToUpdate, ContainerPlayer, ContainerPlayerName, ContainerPlayerScore, ContainerPlayerPoint } from "../styled/ScoreToUpdate.styled";
import { Container, Title, ModalNew, Button, Line, Icon } from "../component.controls";
import { useEffect, useState } from "react";
import { ScoreToSelect } from "../component.pieces";
import useModal from "../../hooks/useModal";
import axios from '../../config/axios';
import socket from "../../config/socket.io";

const ScoreToUpdate = ({score, setScore, fetch, isOpen, close, title="", isCleanable = false, isEditable = false, isSaveable = false, isAcceptable = false}) => {

    // SOCKET.IO ####################################################################################################################################
    const [toggle, setToggle] = useState(true)
    
    useEffect(() => {
        socket.on('server:score', () => setToggle(!toggle));
        return () => socket.off();
    }, [toggle]);

    useEffect(() => {
        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toggle]);

    // STATE ########################################################################################################################################
    const [currentIndexSetNumber, setCurrentIndexSetNumber] = useState(0);
    

    // MODAL ########################################################################################################################################
    const [isOpenModalScoreToSelect, openModalScoreToSelect, closeModalScoreToSelect] = useModal();
    const showModalScoreToSelect = currentIndexSetNumber => {
        if(!isEditable) return null;
        setCurrentIndexSetNumber(currentIndexSetNumber);
        openModalScoreToSelect();
    };

    // API CALLS ####################################################################################################################################
    const cleanScoreByMatchId = async match_id => {
        try {
            const res = await axios.put("score/clean/" + match_id);
            if(res.data.result.cod !== 0) return alert('Otro problema!, error: ' + res.data.result.msg);
                socket.emit('client:score');
                fetch();
                close();
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const saveScore = async () => {
        try {
            const res = await axios.post("score", {score});
            if(res.data.result.cod !== 0) return alert('Otro problema!, error: ' + res.data.result.msg);
                socket.emit('client:score');
                fetch();
                close();
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    // HANDLE #######################################################################################################################################
    const reverseScoreByIndex = index => {
        if(!isEditable) return null;
        let new_score = [...score];
        const point = new_score[index].point;
        switch(index) {
            case 0:
                new_score[0].point = new_score[3].point;
                new_score[3].point = point;
                break;
            case 1:
                new_score[1].point = new_score[4].point;
                new_score[4].point = point;
                break;
            case 2:
                new_score[2].point = new_score[5].point;
                new_score[5].point = point;
                break;
            default: 
                break;
        };
        setScore(new_score);
    };

    // RENDER #######################################################################################################################################
    const renderTitle = (match_id, title) => {
        return (
            <Title.Basic fontSize="13px">
                {title}
                {isCleanable && <Icon.Basic family="clear" onClick={() => cleanScoreByMatchId(match_id)} hover size="20px" left="10px" top="12px" />}
            </Title.Basic>       
        );
    };

    const renderPlayerName = playerName => {
        return <ContainerPlayerName>{playerName}</ContainerPlayerName>;
    };

    const renderButtons = () => {
        if (isSaveable) return <Button.Basic onClick={() => saveScore()} width="100%">Save</Button.Basic>
        if (isAcceptable) {
            return (
                <>
                    <Button.Basic onClick={() => saveScore()} width="100%" margin="0 0 10px 0" family="agree">👍 I agree</Button.Basic>
                    <Button.Basic onClick={() => saveScore()} width="100%" family="disagree">👎 I don't agree</Button.Basic>
                </>
            );
        };
        return null;
    };

    const renderScoreToUpdate = ({score}) => {
        if(!score[0]?.player_id) return null;
        return (
            <>
                <ModalNew.ForForm isOpen={isOpen} closeModal={close}>
                    <Container.Basic>
                        {renderTitle(score[0].match_id, title)}
                        <ContainerScoreToUpdate>
                                <ContainerPlayer>
                                    {renderPlayerName("Set")}
                                    <ContainerPlayerScore>
                                        <ContainerPlayerPoint hover pointer onClick={() => showModalScoreToSelect(0)}>{score[0].set_number}</ContainerPlayerPoint>
                                        <ContainerPlayerPoint hover pointer onClick={() => showModalScoreToSelect(1)}>{score[1].set_number}</ContainerPlayerPoint>
                                        <ContainerPlayerPoint hover pointer onClick={() => showModalScoreToSelect(2)}>{score[2].set_number}</ContainerPlayerPoint>
                                    </ContainerPlayerScore>
                                </ContainerPlayer>
                                <Line.Basic />
                                <ContainerPlayer>
                                    {renderPlayerName(score[0].player_fullname)}
                                    <ContainerPlayerScore>
                                        <ContainerPlayerPoint onClick={() => reverseScoreByIndex(0)}>{score[0].point}</ContainerPlayerPoint>
                                        <ContainerPlayerPoint onClick={() => reverseScoreByIndex(1)}>{score[1].point}</ContainerPlayerPoint>
                                        <ContainerPlayerPoint onClick={() => reverseScoreByIndex(2)}>{score[2].point}</ContainerPlayerPoint>
                                    </ContainerPlayerScore>
                                </ContainerPlayer>
                                <ContainerPlayer>
                                    {renderPlayerName(score[3].player_fullname)}
                                    <ContainerPlayerScore>
                                        <ContainerPlayerPoint onClick={() => reverseScoreByIndex(0)}>{score[3].point}</ContainerPlayerPoint>
                                        <ContainerPlayerPoint onClick={() => reverseScoreByIndex(1)}>{score[4].point}</ContainerPlayerPoint>
                                        <ContainerPlayerPoint onClick={() => reverseScoreByIndex(2)}>{score[5].point}</ContainerPlayerPoint>
                                    </ContainerPlayerScore>
                                </ContainerPlayer>
                        </ContainerScoreToUpdate>
                        {renderButtons()}
                    </Container.Basic>
                </ModalNew.ForForm>

                {/* SCORE TO SELECT ################################################################################################################# */}
                <ScoreToSelect score={score} setScore={setScore} indexSetNumber={currentIndexSetNumber} isOpen={isOpenModalScoreToSelect} close={closeModalScoreToSelect} />
            </>
        );
    };

    // RETURN #######################################################################################################################################
    return renderScoreToUpdate({score});
};

export default ScoreToUpdate;