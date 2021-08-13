import { useState,useEffect } from "react";
import { Container, Select2, Loading, ButtonCircleIcon, Message } from "../component.controls";
import { ScoreToShow, ScoreToUpdate } from "../component.pieces";
import { ContainerChampionships, ContainerChampionship, ContainerChampionshipHeader, ContainerScores } from "../styled/PlayerResult.styled";
import useAppContext from '../../hooks/useAppContext';
import { MSG_NO_CHAMPIONSHIP, MSG_NO_PLAYERS } from "../../helpers/parameters.helper";
import { filterMatchesByChampionshipId, filterScoresByMatchId } from "../../helpers/filter.helper";

// CUSTOM HOOKS #####################################################################################################################################
import { useUserPlayer } from "../../custom-hooks/useUserPlayer";
import { useChampionship } from "../../custom-hooks/useChampionship";
import { useMatch } from "../../custom-hooks/useMatch";
import { useScore } from "../../custom-hooks/useScore";
import { useSocket } from "../../custom-hooks/useSocket";
import useModal from "../../hooks/useModal";

const PlayerResult = () => {
    
    // CONTEXT ######################################################################################################################################
    const { user } = useAppContext();

    // CUSTOM HOOKS #################################################################################################################################
    const { userPlayers, loading: loadingUserPlayers } = useUserPlayer("fetchUserPlayersByUserId", user.user_id);
    const { championships, fetchChampionshipsByPlayerId, loading: loadingChampionships } = useChampionship("fetchChampionshipsByPlayerId", user.player_id);
    const { matches, fetchMatchesByPlayerId, loading: loadingMatches } = useMatch("fetchMatchesByPlayerId",  user.player_id);
    const { scores, fetchScoresByPlayerId, loading: loadingScores } = useScore("fetchScoresByPlayerId", user.player_id);
    const { socketToggle, socketEmit } = useSocket('server:score');
    const [isOpenModalScoreToUpdate, openModalScoreToUpdate, closeModalScoreToUpdate] = useModal();

    // FETCH ########################################################################################################################################
    const fetchPlayerResultByPlayerId = async player_id => {
        await fetchChampionshipsByPlayerId(player_id);
        await fetchMatchesByPlayerId(player_id);
        await fetchScoresByPlayerId(player_id);
    };

    // STATE ########################################################################################################################################
    const [showedChampionshipsId, setShowedChampionshipsId] = useState([]);
    const [currentScore, setCurrentScore] = useState([]);
    const [currentPlayerId, setCurrentPlayerId] = useState(user.player_id);
    const [scoreToUpdateOptions, setScoreToUpdateOptions] = useState({title:"", isCleanable: false, isEditable: false, isSaveable: false, isAcceptable: false});

    useEffect(() => {
        fetchScoresByPlayerId(currentPlayerId);
        // eslint-disable-next-line
    }, [socketToggle]);

    // MODAL ########################################################################################################################################
    const showModalScoreToUpdate = score => {
        getScoreToUpdateOptions(score[0].match_state_id, score[0].user_id);
        setCurrentScore(score);
        openModalScoreToUpdate();
    };

    const getScoreToUpdateOptions = (state_id, user_id) => {
        // WAITING
        if (state_id === 4) { 
            if (user_id === user.user_id) return setScoreToUpdateOptions({title:"Updating Score", isCleanable: true, isEditable: true, isSaveable: true, isAcceptable: false}); //FULL EDITABLE
            return setScoreToUpdateOptions({title:"Confirming Score", isCleanable: false, isEditable: false, isSaveable: false, isAcceptable: true}); // SOLO ACEPTABLE
        };
        // PENDING
        if (state_id === 3) return setScoreToUpdateOptions({title:"Updating Score", isCleanable: true, isEditable: true, isSaveable: true, isAcceptable: false}); //FULL EDITABLE
        // FINISH
        if (state_id === 2) return setScoreToUpdateOptions({title:"Score", isCleanable: false, isEditable: false, isSaveable: false, isAcceptable: false}); // READ-ONLY
    };
    
    // HANDLE #######################################################################################################################################
    const handleSelectPlayers = async player_id => {
        setCurrentPlayerId(player_id);
        setShowedChampionshipsId([]);
        await fetchPlayerResultByPlayerId(player_id);
    };

    const handleShowedChampionshipsId = championship_id => {
        if (showedChampionshipsId.indexOf(championship_id) > -1) { // OBTIENE EL INDICE DEL ELEMENTO, SI NO ENCUENTRA EL ELEMENTO RETORNA -1 ########
            setShowedChampionshipsId(showedChampionshipsId.filter(e => e !== championship_id)) // ELIMINA EL ELEMENTO DEL STATE #####################
        } else {
            setShowedChampionshipsId([...showedChampionshipsId, championship_id]); // AGREGA EL ELEMENTO AL STATE ###################################
        };
    };

    // RENDERS ######################################################################################################################################
    const renderSelectUserPlayers = userPlayers => {
        if (!userPlayers || userPlayers.length === 0) return null;
        return <Select2.OnChange label="My players" content={userPlayers} action={handleSelectPlayers}/>
    };

    const renderChampionships = championships => {
        if (!championships) { 
            return null;
        } else {
            if (championships.length === 0) return <Message text={MSG_NO_CHAMPIONSHIP} />
        };
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

    // ]JSX #########################################################################################################################################
    if (user.player_id === 0) return <Message text={MSG_NO_PLAYERS} />
    return (
        <>
            <Container.Basic>
                
                {loadingUserPlayers 
                    ?<Loading/> 
                    :renderSelectUserPlayers(userPlayers)
                }

                {loadingChampionships || loadingMatches || loadingScores 
                    ?<Loading/> 
                    :renderChampionships(championships)
                }

            </Container.Basic>

            {/* SCORE TO UPDATE ##################################################################################################################### */}
            <ScoreToUpdate 
                score={currentScore} 
                setScore={setCurrentScore}
                socketEmit={socketEmit}
                isOpen={isOpenModalScoreToUpdate} 
                close={closeModalScoreToUpdate}
                title={scoreToUpdateOptions.title}
                isCleanable={scoreToUpdateOptions.isCleanable}
                isEditable={scoreToUpdateOptions.isEditable}
                isSaveable={scoreToUpdateOptions.isSaveable}
                isAcceptable={scoreToUpdateOptions.isAcceptable}
             />
        </>

    );
};

export default PlayerResult;