import { useState, useEffect, useCallback } from "react";
import { Container, Select2, Loading, ButtonCircleIcon, Message } from "../../component.controls";
import { ScoreToShow, ScoreToUpdate } from "../../component.pieces";
import { ContainerChampionships, ContainerChampionship, ContainerChampionshipHeader, ContainerScores } from "../styled/PlayerResult.styled";
import useAppContext from '../../hooks/useAppContext';
import useModal from "../../hooks/useModal";
import { getList } from '../../helpers/list.helper'; 
import { MSG_NO_CHAMPIONSHIP, MSG_NO_PLAYERS } from "../../helpers/parameters.helper";
import { filterMatchesByChampionshipId, filterScoresByMatchId } from "../../helpers/filter.helper";

const PlayerResult = () => {
    /*CONTEXT #######################################################################################################################################*/ 
    const { user } = useAppContext();

    // STATE ########################################################################################################################################
    const [players, setPlayers] = useState("");
    const [championships, setChampionships] = useState("");
    const [showedChampionshipsId, setShowedChampionshipsId] = useState([]);
    const [matches, setMatches] = useState([]);
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentScore, setCurrentScore] = useState([]);
    const [currentPlayerId, setCurrentPlayerId] = useState(0);

    // MODAL ########################################################################################################################################
    const [isOpenModalScoreToUpdate, openModalScoreToUpdate, closeModalScoreToUpdate] = useModal();
    const showModalScoreToUpdate = score => {
        setCurrentScore(score);
        openModalScoreToUpdate();
    };

    /*FETCHS ########################################################################################################################################*/ 
    const fetchChampionshipsByPlayerId = async player_id => {
        const championships = await getList("player-result/championships/" + player_id);
        setChampionships(championships);
    };

    const fetchScoresByPlayerId = async player_id => {
        const scores = await getList("player-result/scores/" + player_id);
        setScores(scores);
    };

    const fetchScores = async () => {
        const scores = await getList("player-result/scores/" + currentPlayerId);
        setScores(scores);
    };

    const fetchMatchesByPlayerId = async player_id => {
        const matches = await getList("player-result/matches/" + player_id);
        setMatches(matches);
    };

    const fetchPlayerResultByPlayerId = useCallback(async player_id => {
        setLoading(true);
        setCurrentPlayerId(player_id);
        setShowedChampionshipsId([]);
        await fetchChampionshipsByPlayerId(player_id);
        await fetchMatchesByPlayerId(player_id);
        await fetchScoresByPlayerId(player_id);
        setLoading(false);
    }, []);

    const fetchPlayersByUserId = useCallback(async () => {
        const players = await getList("list/user_player/" + user.id);
        setPlayers(players);
        return players[0]?.player_id;
    }, [user]);

    /*INIT ##########################################################################################################################################*/ 
    const init = useCallback(async () => {
        const first_player_id = await fetchPlayersByUserId();
        if (first_player_id) {
            await fetchPlayerResultByPlayerId(first_player_id);
        };
    }, [fetchPlayersByUserId, fetchPlayerResultByPlayerId]);

    /*EFFECT ########################################################################################################################################*/
    useEffect(() => init(), [init]);

    // RENDERS ######################################################################################################################################
    const renderSelectPlayers = players => {
        if (players === "") return null;
        if (players.length === 0) return <Message text={MSG_NO_PLAYERS} />
        return <Select2.OnChange label="My players" content={players} action={fetchPlayerResultByPlayerId}/>
    };

    const renderDivChampionships = championships => {
        if (championships === "") return null;
        if (championships.length === 0) return <Message text={MSG_NO_CHAMPIONSHIP} />
        return (
            <ContainerChampionships>
                {championships.map(championship => {
                    const matchesFilteredByChampionshipId = matches.filter(filterMatchesByChampionshipId(championship.championship_id));
                    return (
                        <ContainerChampionship key={championship.championship_id} id={championship.championship_id}>
                            <ContainerChampionshipHeader onClick={() => handleShowedChampionshipsId(championship.championship_id)}>
                                <ButtonCircleIcon.Basic family={"add"} margin="0 5px 0 0"/>
                                {championship.championship_name}
                            </ContainerChampionshipHeader>
                            {renderScoresByMatches(matchesFilteredByChampionshipId)}
                        </ContainerChampionship>
                    );
                })}
            </ContainerChampionships>
        );
    };

    const renderScoresByMatches = matches => {
        const show = showedChampionshipsId.includes(matches[0]?.championship_id) ? "show" : "hide";
        return (
            <ContainerScores className={show}>
                {matches.map(
                    match => <ScoreToShow key={match.match_id} score={scores.filter(filterScoresByMatchId(match.match_id))} action={showModalScoreToUpdate}></ScoreToShow>
                )}
            </ContainerScores>
        );
    };

    // HANDLES ######################################################################################################################################
    const handleShowedChampionshipsId = championship_id => {
        if (showedChampionshipsId.indexOf(championship_id) > -1) { // OBTIENE EL INDICE DEL ELEMENTO, SI NO ENCUENTRA EL ELEMENTO RETORNA -1 ########
            setShowedChampionshipsId(showedChampionshipsId.filter(e => e !== championship_id)) // ELIMINA EL ELEMENTO DEL STATE #####################
        } else {
            setShowedChampionshipsId([...showedChampionshipsId, championship_id]); // AGREGA EL ELEMENTO AL STATE ###################################
        };
    };

    // ]JSX #########################################################################################################################################
    return (
        <>
            <Container.Basic>
                {renderSelectPlayers(players)}
                {loading ?<Loading/> :renderDivChampionships(championships)}
            </Container.Basic>

            {/* SCORE TO UPDATE ##################################################################################################################### */}
            <ScoreToUpdate score={currentScore} setScore={setCurrentScore} fetch={fetchScores} isOpen={isOpenModalScoreToUpdate} close={closeModalScoreToUpdate} />
        </>
        
    );
};

export default PlayerResult;