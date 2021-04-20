import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from "react";
import { getList } from '../../helpers/listHelper';
import { Input, Container, Loading, Title, Modal, Button, Line } from "../../component";
import useModal from "../../hooks/useModal";
import axios from '../../config/axios';

const Match = () => {
    const { prm_group_id } = useParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [matches, setMatches] = useState([]);
    const [scores, setScores] = useState([]);
    const defaultCurrentScore = [{point:0}, {point:0}, {point:0}, {point:0}, {point:0}, {point:0}];
    const [currentScore, setCurrentScore] = useState(defaultCurrentScore);
        
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
    // const filterScoreByPlayerId = player_id => element => {
    //     return element.player_id === player_id;
    // };

    /*MODAL ##########################################################################################*/
    const [isOpenModalCrud, openModalCrud, closeModalCrud] = useModal();
    const showModalCrud = score => {
        setCurrentScore(score);
        openModalCrud();
    };

    /*HANDLE #########################################################################################*/
    const handleScore = e => {
        let new_score = [...currentScore];
        new_score[e.target.id].point = e.target.value;
        setCurrentScore(new_score);
    };

    /*CRUD ###########################################################################################*/
    const saveScore = async () => {
        const score = currentScore.filter(e => typeof(e.point) === 'string');
        try {
            const res = await axios.post("score", {score});
            if(res.data.result.cod !== 0) return alert('Otro problema!, error: ' + res.data.result.msg);
                fetchMatchesScores();
                closeModalCrud();
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    /*RENDER FX ######################################################################################*/
    const ScorePoint = ({score}) => {
        const scoreToCrud = score.map(item => {return {...item}});
        return (
            <div className="score" onClick={() => showModalCrud(scoreToCrud)}>
                <div className="player">
                    <div className="player-name">Game</div>
                    <div className="player-score">
                        <div className="player-points">{score[0]?.game}</div>
                        <div className="player-points">{score[1]?.game}</div>
                        <div className="player-points">{score[2]?.game}</div>
                    </div>
                </div>
                <Line.Basic />
                <div className="player">
                    <div className="player-name">{score[0]?.player_fullname}</div>
                    <div className="player-score">
                        <div className="player-points">{score[0]?.point}</div>
                        <div className="player-points">{score[1]?.point}</div>
                        <div className="player-points">{score[2]?.point}</div>
                    </div>
                </div>
                <div className="player">
                    <div className="player-name">{score[3]?.player_fullname}</div>
                    <div className="player-score">
                        <div className="player-points">{score[3]?.point}</div>
                        <div className="player-points">{score[4]?.point}</div>
                        <div className="player-points">{score[5]?.point}</div>
                    </div>
                </div>  
            </div>
        );
    };

    /*JSX ############################################################################################*/ 
    return (
        <Container.Primary>
            <Title.Basic fontSize="20px">{matches[0]?.championship_name}</Title.Basic> 
            <Title.Basic>{matches[0]?.group_name}</Title.Basic>
            <div className="search-container">
                <Input.TextAction name="search" placeholder="Search..." value={searchTerm} action={setSearchTerm} />
            </div>
            {loading 
                ? <Loading/>
                : <Container.Score>
                    {matches.map(match => {
                        const score = scores.filter(filterScoreByMatchId(match.match_id));
                        return <ScorePoint key={match.match_id} score={score}/>
                    })}
                </Container.Score>
            }
            {/* MODAL CRUD ###########################################################################*/}
            <Modal.ForForm isOpen={isOpenModalCrud} closeModal={closeModalCrud}>
                <Container.Basic>
                    <Title.Basic>Score</Title.Basic>
                    <Container.ScoreCrud>
                        <div className="score">
                            
                            <div className="player">
                                <div className="player-name">Game</div>
                                <div className="player-score">
                                    <div className="player-points">{currentScore[0]?.game}</div>
                                    <div className="player-points">{currentScore[1]?.game}</div>
                                    <div className="player-points">{currentScore[2]?.game}</div>
                                </div>
                            </div>

                            <div className="line" />

                            <div className="player">
                                <div className="player-name">{currentScore[0]?.player_fullname}</div>
                                <div className="player-score">
                                    <input className="player-points" type="number" name={currentScore[0]?.score_id} id={0} value={currentScore[0]?.point} onChange={e => handleScore(e)}/>
                                    <input className="player-points" type="number" name={currentScore[1]?.score_id} id={1} value={currentScore[1]?.point} onChange={e => handleScore(e)}/>
                                    <input className="player-points" type="number" name={currentScore[2]?.score_id} id={2} value={currentScore[2]?.point} onChange={e => handleScore(e)}/>
                                </div>
                            </div>

                            <div className="player">
                                <div className="player-name">{currentScore[3]?.player_fullname}</div>
                                <div className="player-score">
                                    <input className="player-points" type="number" name={currentScore[3]?.score_id} id={3} value={currentScore[3]?.point} onChange={e => handleScore(e)}/>
                                    <input className="player-points" type="number" name={currentScore[4]?.score_id} id={4} value={currentScore[4]?.point} onChange={e => handleScore(e)}/>
                                    <input className="player-points" type="number" name={currentScore[5]?.score_id} id={5} value={currentScore[5]?.point} onChange={e => handleScore(e)}/>
                                </div>
                            </div>

                        </div>
                        
                    </Container.ScoreCrud>
                    <Button.Basic action={() => saveScore()} width="100%">Save</Button.Basic>
                </Container.Basic>
            </Modal.ForForm>
        </Container.Primary>
    );
};
export default Match;