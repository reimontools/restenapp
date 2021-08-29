import { useState } from "react";
import { Container, Title, Select2, Loading, ButtonCircleIcon, Message } from "../component.controls";
import { ScoreToShow, ScoreToUpdate } from "../component.pieces";
import { ContainerChampionships, ContainerChampionship, ContainerChampionshipHeader, ContainerScores } from "../styled/PlayerResult.styled";
import useAppContext from '../../hooks/useAppContext';
import { MSG_NO_CHAMPIONSHIP, MSG_NO_PLAYERS } from "../../helpers/parameters.helper";

// CUSTOM HOOKS #####################################################################################################################################
import { useUserPlayer } from "../../custom-hooks/useUserPlayer";
import { useSocket } from "../../custom-hooks/useSocket";
import { useResultByPlayerId } from "../../custom-hooks/useResultByPlayerId";
import useModal from "../../hooks/useModal";

const PlayerResult = () => {
    // CONTEXT ######################################################################################################################################
    const { user } = useAppContext();
    
    // CUSTOM HOOKS #################################################################################################################################
    const { userPlayers, loading: loadingUserPlayers } = useUserPlayer("fetchUserPlayersByUserId", user.user_id);
    const { socketToggle, socketEmit } = useSocket('server:score');
    const { result, setPlayerId, loading: loadingResult } = useResultByPlayerId(userPlayers[0]?.player_id, socketToggle);
    const [isOpenModalScoreToUpdate, openModalScoreToUpdate, closeModalScoreToUpdate] = useModal();
    
    // STATE ########################################################################################################################################
    const [showedChampionshipsId, setShowedChampionshipsId] = useState([]);
    const [currentScore, setCurrentScore] = useState([]);
    const [scoreToUpdateOptions, setScoreToUpdateOptions] = useState({title:"", isCleanable: false, isEditable: false, isSaveable: false, isAcceptable: false});

    // MODAL ########################################################################################################################################
    const showModalScoreToUpdate = score => {
        getScoreToUpdateOptions(score[0].match_state_id, score[0].user_id);
        setCurrentScore(score);
        openModalScoreToUpdate();
    };

    const getScoreToUpdateOptions = (match_state_id, user_id) => {
        // WAITING
        if (match_state_id === 4) { 
            if (user_id === user.user_id) return setScoreToUpdateOptions({title:"Updating Score", isCleanable: true, isEditable: true, isSaveable: true, isAcceptable: false}); //FULL EDITABLE
            return setScoreToUpdateOptions({title:"Confirming Score", isCleanable: false, isEditable: false, isSaveable: false, isAcceptable: true}); // SOLO ACEPTABLE
        };
        // PENDING
        if (match_state_id === 3) return setScoreToUpdateOptions({title:"Updating Score", isCleanable: true, isEditable: true, isSaveable: true, isAcceptable: false}); //FULL EDITABLE
        // FINISH AND REJECT
        if (match_state_id === 2 || match_state_id === 5) return setScoreToUpdateOptions({title:"Score", isCleanable: false, isEditable: false, isSaveable: false, isAcceptable: false}); // READ-ONLY
    };
    
    // HANDLE #######################################################################################################################################
    const handleSelectPlayers = async player_id => {
        setShowedChampionshipsId([]);
        await setPlayerId(player_id);
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
        if (!userPlayers) return null;
        if (userPlayers.length === 0) return <Message text={MSG_NO_PLAYERS} />
        return <Select2.OnChange label="My players" content={userPlayers} action={handleSelectPlayers} width="90%"/>
    };

    const renderResult = championships => {
        if (!championships) return null;
        if (championships.length === 0) return <Message text={MSG_NO_CHAMPIONSHIP} />
        return (
            <ContainerChampionships>
                {championships.map(championship => {
                    return (
                        <ContainerChampionship key={championship.championship_id} id={championship.championship_id}>
                            <ContainerChampionshipHeader onClick={() => handleShowedChampionshipsId(championship.championship_id)}>
                                <ButtonCircleIcon.Basic family={"add"} margin="0 5px 0 0"/>
                                {championship.championship_name}
                            </ContainerChampionshipHeader>
                            {renderScoresByMatches(championship.matches)}
                        </ContainerChampionship>
                    );
                })}
            </ContainerChampionships>
        );
    };

    const renderScoresByMatches = matches => {
        const show = showedChampionshipsId.includes(matches[0].championship_id) ? "show" : "hide";
        return (
            <ContainerScores className={show}>
                {matches.map(
                    match => <ScoreToShow 
                        key={match.match_id} 
                        scores={match.scores} 
                        action={showModalScoreToUpdate} />
                )}
            </ContainerScores>
        );
    };

    const renderTitle = () => {
        return <Title.Basic flexJustifyContent="flex-start" margin="13px 0 7px 0" width="90%">Player result</Title.Basic>;
    };
    
    // JSX ##########################################################################################################################################
    return (
        <>
            <Container.Primary>
                {renderTitle()}
                {loadingUserPlayers ?<Loading/> :renderSelectUserPlayers(userPlayers)}
                {loadingResult ?<Loading/> :renderResult(result.championships)}
            </Container.Primary>

            {/* SCORE TO UPDATE ##################################################################################################################### */}
            <ScoreToUpdate score={currentScore} setScore={setCurrentScore} socketEmit={socketEmit} isOpen={isOpenModalScoreToUpdate} close={closeModalScoreToUpdate} title={scoreToUpdateOptions.title} isCleanable={scoreToUpdateOptions.isCleanable} isEditable={scoreToUpdateOptions.isEditable} isSaveable={scoreToUpdateOptions.isSaveable} isAcceptable={scoreToUpdateOptions.isAcceptable} />
        
        </>
        
    );
};

export default PlayerResult;