import { useParams, useHistory } from 'react-router-dom';
import { useState, useEffect, useCallback } from "react";
import { getList } from '../../helpers/listHelper';
import { Input, Container, Loading, Title, Modal, Button, Line, ContainerScoreCrud, Simbol, ContainerNumber, ContainerScore, Icon, ButtonFloat, DropDownButtonFloat, Dialog } from "../../component";
import useModal from "../../hooks/useModal";
import axios from '../../config/axios';

const Match = () => {
    const { prm_championship_id, prm_championship_type_id, prm_group_id } = useParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [matches, setMatches] = useState([]);
    const [scores, setScores] = useState([]);
    const defaultCurrentScore = [{point:0}, {point:0}, {point:0}, {point:0}, {point:0}, {point:0}];
    const [currentScore, setCurrentScore] = useState(defaultCurrentScore);
    const [currentScoreIndex, setCurrentScoreIndex] = useState(0);

    const history = useHistory();

    // DIALOG #######################################################################################################################################
    const [dialogOptions, setDialogOptions] = useState({});

    /*FETCH ###########################################################################################*/
    const fetchMatches = async id => {
        const res = await getList("match/" + id);
        setMatches(res);
    };
    const fetchScores = async id => {
        const res = await getList("score/" + id);
        setScores(res);
    };
    const fetchMatchesScores = useCallback(() => {
        setLoading(true);
        fetchMatches(prm_group_id);
        fetchScores(prm_group_id);
        setLoading(false);
    }, [prm_group_id])

    /*EFFECT #########################################################################################*/
    useEffect(() => {
        fetchMatchesScores();
    }, [fetchMatchesScores]);

    /*FILTER #########################################################################################*/
    const filterScoreByMatchId = match_id => element => {
        return element.match_id === match_id;
    };

    /*MODAL ##########################################################################################*/
    const [isOpenModalCrud, openModalCrud, closeModalCrud] = useModal();
    const showModalCrud = score => {
        setCurrentScore(score);
        openModalCrud();
    };

    const [isOpenModalNumbers, openModalNumbers, closeModalNumbers] = useModal();
    const showModalNumbers = e => {
        setCurrentScoreIndex(e.target.id);
        openModalNumbers();
    };

    /*HANDLE #########################################################################################*/
    const handleScore = e => {
        let new_score = [...currentScore];
        const value = e.target.id;
        switch(currentScoreIndex) {
            case "0":
                new_score[0].point = value[0];
                new_score[3].point = value[1];
                break;
            case "1":
                new_score[1].point = value[0];
                new_score[4].point = value[1];
                break;
            default: //if it is 2
                new_score[2].point = value[0];
                new_score[5].point = value[1];
                break;
        };
        setCurrentScore(new_score);
        closeModalNumbers();
    };

    const handleScoreChange = e => {
        let new_score = [...currentScore];
        const value = new_score[e.target.id].point;
        switch(e.target.id) {
            case "0":
                new_score[0].point = new_score[3].point;
                new_score[3].point = value;
                break;
            case "1":
                new_score[1].point = new_score[4].point;
                new_score[4].point = value;
                break;
            default: //if it is 2
                new_score[2].point = new_score[5].point;
                new_score[5].point = value;
                break;
        };
        setCurrentScore(new_score);
    };

    /*CRUD ###########################################################################################*/
    const saveScore = async () => {
        try {
            const res = await axios.post("score", {score: currentScore});
            if(res.data.result.cod !== 0) return alert('Otro problema!, error: ' + res.data.result.msg);
                fetchMatchesScores();
                closeModalCrud();
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const initScore = async match_id => {
        try {
            const res = await axios.put("score/" + match_id);
            if(res.data.result.cod !== 0) return alert('Otro problema!, error: ' + res.data.result.msg);
                fetchMatchesScores();
                closeModalCrud();
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    /*LOCAL COMPONENTS ###############################################################################*/
    const ScorePoint = ({score}) => {
        if(!score[0]?.player_id) return null;
        const scoreToCrud = score.map(item => {return {...item}});

        let color = "#0e70b8";
        if(score[0].match_state_id === 2) {
            color = "green"
        };

        return (
            <ContainerScore.Container color={color} onClick={() => showModalCrud(scoreToCrud)}>
                <MatchState score={score} />
                <div className="player">
                    <div className="player-name">Set</div>
                    <div className="player-score">
                        <div className="player-points">{score[0]?.set_number}</div>
                        <div className="player-points">{score[1]?.set_number}</div>
                        <div className="player-points">{score[2]?.set_number}</div>
                    </div>
                </div>
                <Line.Basic color={color} />
                <div className="player">
                    <PlayerWinner score={score} index={0}/>
                    <div className="player-score">
                        <div className="player-points">{score[0]?.point}</div>
                        <div className="player-points">{score[1]?.point}</div>
                        <div className="player-points">{score[2]?.point}</div>
                    </div>
                </div>
                <div className="player">
                    <PlayerWinner score={score} index={3}/>
                    <div className="player-score">
                        <div className="player-points">{score[3]?.point}</div>
                        <div className="player-points">{score[4]?.point}</div>
                        <div className="player-points">{score[5]?.point}</div>
                    </div>
                </div>
            </ContainerScore.Container>
        );
    };

    const PlayerWinner = ({score, index}) => {
        if(score[index].player_id === score[0].player_winner_id) return <div className="player-name">{score[index]?.player_fullname} <Simbol.Star /></div>;
        return <div className="player-name">{score[index]?.player_fullname}</div>
    };

    const MatchState = ({score}) => {
        if(score[0].match_state_id === 2) {
            return <div className="match-state">{score[0].match_state_name} <Simbol.Check /></div>;
        };
        if(score[0].match_state_id === 3) {
            return <div className="match-state">{score[0].match_state_name} <Simbol.Point /></div>;
        };
        return null;
    };

    // CRUD #########################################################################################################################################
    const initMatchRandomByGroupId = async group_id => {
        try {
            const res = await axios.post("match/random/", {group_id});
            if (res.data.result.cod === 0) return fetchMatchesScores();
            setDialogOptions({
                family: "info", 
                title: 'Alert', 
                text : 'Error: ' + res.data.result.msg
            });
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const initMatchOrderByGroupId = async group_id => {
        try {
            const res = await axios.post("match/ordened/", {group_id});
            if (res.data.result.cod === 0) return fetchMatchesScores();
            setDialogOptions({
                family: "info", 
                title: 'Alert', 
                text : 'Error: ' + res.data.result.msg
            });
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const initMatchAgainstByGroupId = async group_id => {
        try {
            const res = await axios.post("match/against/", {group_id});
            if (res.data.result.cod === 0) return fetchMatchesScores();
            setDialogOptions({
                family: "info", 
                title: 'Alert', 
                text : 'Error: ' + res.data.result.msg
            });
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    // HANDLES ######################################################################################################################################
    const handleGoBack = e => {
        e.stopPropagation();
        history.push('/championship/group/' + prm_championship_id + '/' + prm_championship_type_id);
    };

    const handleInitMatchRandomByGroupId = () => {
        // e.stopPropagation();
        setDialogOptions({
            family: "question", 
            title: 'Redo randomly', 
            text: 'Are you sure you want to redo this group of matches randomly?', 
            subtext: 'Current matches will be overwritten!',
            action: () => initMatchRandomByGroupId(prm_group_id)
        });
    };

    const handleInitMatchOrderByGroupId = () => {
        // e.stopPropagation();
        setDialogOptions({
            family: "question", 
            title: 'Redo in order', 
            text: 'Are you sure you want to redo this group of matches in order?', 
            subtext: 'Current matches will be overwritten!',
            action: () => initMatchOrderByGroupId(prm_group_id)
        });
    };

    const handleInitMatchAgainstByGroupId = () => {
        setDialogOptions({
            family: "question", 
            title: 'Redo all against all', 
            text: 'Are you sure you want to redo this group of matches "all against all"?', 
            subtext: 'Current matches will be overwritten!',
            action: () => initMatchAgainstByGroupId(prm_group_id)
        });
    };

    // RENDERS ######################################################################################################################################
    const renderDropDownButtonFloat = () => {
        return (
            <DropDownButtonFloat.Basic family="moreFloat" bottom="65px">
                <div className="content" onClick={() => handleInitMatchRandomByGroupId()}>Redo randomly</div>
                <div className="content" onClick={() => handleInitMatchOrderByGroupId()}>Redo according to order</div>
                <div className="content" onClick={() => handleInitMatchAgainstByGroupId()}>Redo all Against all</div>
            </DropDownButtonFloat.Basic>
        );
    };

    // JSX ##########################################################################################################################################
    return (
        <Container.Primary>
            {/* <Title.Basic fontSize="20px">{matches[0]?.championship_name}</Title.Basic>
            <Title.Basic>{matches[0]?.group_name}</Title.Basic> */}
            <Title.Basic fontSize="20px">Matches</Title.Basic> 
            <div className="search-container">
                <Input.TextAction name="search" placeholder="Search..." value={searchTerm} action={setSearchTerm} />
            </div>
            {loading
                ? <Loading/>
                : <Container.FlexWrap>
                    {matches.map(match => {
                        const score = scores.filter(filterScoreByMatchId(match.match_id));
                        return <ScorePoint key={match.match_id} score={score}/>
                    })}
                </Container.FlexWrap>
            }
            {/* MODAL CRUD ###########################################################################*/}
            <Modal.ForForm isOpen={isOpenModalCrud} closeModal={closeModalCrud}>
                <Container.Basic>
                    <Title.Basic>
                        Score
                        <Icon.Basic family="clear" onClick={() => initScore(currentScore[0].match_id)} hover size="30px" left="10px" top="10px"/>
                    </Title.Basic>
                    <ContainerScoreCrud.Container>
                        <ContainerScoreCrud.Score>
                            <ContainerScoreCrud.Player>
                                <ContainerScoreCrud.PlayerName>Set</ContainerScoreCrud.PlayerName>
                                <ContainerScoreCrud.PlayerScore>
                                    <ContainerScoreCrud.PlayerPoint id={0} hover pointer onClick={e => showModalNumbers(e)}>{currentScore[0]?.set_number}</ContainerScoreCrud.PlayerPoint>
                                    <ContainerScoreCrud.PlayerPoint id={1} hover pointer onClick={e => showModalNumbers(e)}>{currentScore[1]?.set_number}</ContainerScoreCrud.PlayerPoint>
                                    <ContainerScoreCrud.PlayerPoint id={2} hover pointer onClick={e => showModalNumbers(e)}>{currentScore[2]?.set_number}</ContainerScoreCrud.PlayerPoint>
                                </ContainerScoreCrud.PlayerScore>
                            </ContainerScoreCrud.Player>
                            <Line.Basic />
                            <ContainerScoreCrud.Player>
                                <ContainerScoreCrud.PlayerName>{currentScore[0]?.player_fullname}</ContainerScoreCrud.PlayerName>
                                <ContainerScoreCrud.PlayerScore>
                                    <ContainerScoreCrud.PlayerPoint id={0} onClick={e => handleScoreChange(e)}>{currentScore[0]?.point}</ContainerScoreCrud.PlayerPoint>
                                    <ContainerScoreCrud.PlayerPoint id={1} onClick={e => handleScoreChange(e)}>{currentScore[1]?.point}</ContainerScoreCrud.PlayerPoint>
                                    <ContainerScoreCrud.PlayerPoint id={2} onClick={e => handleScoreChange(e)}>{currentScore[2]?.point}</ContainerScoreCrud.PlayerPoint>
                                </ContainerScoreCrud.PlayerScore>
                            </ContainerScoreCrud.Player>
                            <ContainerScoreCrud.Player>
                                <ContainerScoreCrud.PlayerName>{currentScore[3]?.player_fullname}</ContainerScoreCrud.PlayerName>
                                <ContainerScoreCrud.PlayerScore>
                                    <ContainerScoreCrud.PlayerPoint id={0} onClick={e => handleScoreChange(e)}>{currentScore[3]?.point}</ContainerScoreCrud.PlayerPoint>
                                    <ContainerScoreCrud.PlayerPoint id={1} onClick={e => handleScoreChange(e)}>{currentScore[4]?.point}</ContainerScoreCrud.PlayerPoint>
                                    <ContainerScoreCrud.PlayerPoint id={2} onClick={e => handleScoreChange(e)}>{currentScore[5]?.point}</ContainerScoreCrud.PlayerPoint>
                                </ContainerScoreCrud.PlayerScore>
                            </ContainerScoreCrud.Player>
                        </ContainerScoreCrud.Score>
                    </ContainerScoreCrud.Container>
                    <Button.Basic onClick={() => saveScore()} width="100%">Save</Button.Basic>
                </Container.Basic>
            </Modal.ForForm>
            {/* MODAL NUMBERS ########################################################################*/}
            <Modal.ForForm isOpen={isOpenModalNumbers} closeModal={closeModalNumbers}>
                <Container.Basic>
                    <Title.Basic>Points</Title.Basic>
                    <ContainerNumber.Container>
                        <ContainerNumber.Number id={"60"} onClick={e => handleScore(e)}>6/0</ContainerNumber.Number>
                        <ContainerNumber.Number id={"61"} onClick={e => handleScore(e)}>6/1</ContainerNumber.Number>
                        <ContainerNumber.Number id={"62"} onClick={e => handleScore(e)}>6/2</ContainerNumber.Number>
                        <ContainerNumber.Number id={"63"} onClick={e => handleScore(e)}>6/3</ContainerNumber.Number>
                        <ContainerNumber.Number id={"64"} onClick={e => handleScore(e)}>6/4</ContainerNumber.Number>
                        <ContainerNumber.Number id={"75"} onClick={e => handleScore(e)}>7/5</ContainerNumber.Number>
                    </ContainerNumber.Container>
                </Container.Basic>
            </Modal.ForForm>

            {/* DIALOG  ############################################################################################################################# */}
            <Dialog.Action options={dialogOptions} close={() => setDialogOptions({})} />
            
            {/* BACK ################################################################################################################################ */}
            {renderDropDownButtonFloat()}

            {/* BUTTON BACK ######################################################################################################################### */}
            <ButtonFloat.Icon onClick={e => handleGoBack(e)} hover family="backFloat" />

        </Container.Primary>
    );
};
export default Match;