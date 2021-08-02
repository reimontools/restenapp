import { ContainerScores, ContainerScore } from "../styled/ScoreToSelect.styled";
import { Container, Title, Modal } from "../../component.controls";

const ScoreToSelect = ({score, setScore, indexSetNumber, isOpen, close}) => {

    const setScoreSelected = scoreSelected => {
        let new_score = [...score];
        switch(indexSetNumber) {
            case 0:
                new_score[0].point = scoreSelected[0];
                new_score[3].point = scoreSelected[1];
                break;
            case 1:
                new_score[1].point = scoreSelected[0];
                new_score[4].point = scoreSelected[1];
                break;
            case 2: 
                new_score[2].point = scoreSelected[0];
                new_score[5].point = scoreSelected[1];
                break;
            default: 
                break;
        };
        setScore(new_score);
        close();
    };

    const renderTitle = () => {
        return (
            <Title.Basic>Points</Title.Basic>
        );
    };

    // JSX ##########################################################################################################################################
    return (
        <Modal.ForForm isOpen={isOpen} closeModal={close}>
            <Container.Basic>
                {renderTitle()}
                <ContainerScores>
                    <ContainerScore onClick={() => setScoreSelected("60")}>6/0</ContainerScore>
                    <ContainerScore onClick={() => setScoreSelected("61")}>6/1</ContainerScore>
                    <ContainerScore onClick={() => setScoreSelected("62")}>6/2</ContainerScore>
                    <ContainerScore onClick={() => setScoreSelected("63")}>6/3</ContainerScore>
                    <ContainerScore onClick={() => setScoreSelected("64")}>6/4</ContainerScore>
                    <ContainerScore onClick={() => setScoreSelected("75")}>7/5</ContainerScore>
                </ContainerScores>
            </Container.Basic>
        </Modal.ForForm>
    );
};

export default ScoreToSelect;