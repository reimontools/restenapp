import { useState, useEffect, useCallback } from "react";
import { Container, Select2, Loading, ButtonCircleIcon, Score, Message } from "../../component";
import { ContainerChampionships, ContainerChampionship, ContainerChampionshipHeader, ContainerScores } from "../styled/PlayerResult.styled";
import { getList } from '../../helpers/listHelper'; 
import useAppContext from '../../hooks/useAppContext';
import { MSG_NO_CHAMPIONSHIP, MSG_NO_PLAYERS } from "../../helpers/paramHelper";

const PlayerResult = () => {
    /*CONTEXT #######################################################################################################################################*/ 
    const { user } = useAppContext();

    /*STATE #########################################################################################################################################*/ 
    const [players, setPlayers] = useState("");
    const [championships, setChampionships] = useState("");
    const [showedChampionshipsId, setShowedChampionshipsId] = useState([]);
    const [matches, setMatches] = useState([]);
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(false);

    /*FETCHS ########################################################################################################################################*/ 
    const fetchChampionshipsByPlayerId = async player_id => {
        const championships = await getList("player-result/championships/" + player_id);
        setChampionships(championships);
    };

    const fetchScoresByPlayerId = async player_id => {
        const scores = await getList("player-result/scores/" + player_id);
        setScores(scores);
    };

    const fetchMatchesByPlayerId = async player_id => {
        const matches = await getList("player-result/matches/" + player_id);
        setMatches(matches);
    };

    const fetchPlayerResultByPlayerId = useCallback(async player_id => {
        setLoading(true);
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

    /*FILTER #########################################################################################*/
    const filterMatchesByChampionshipId = championship_id => e => {
        return e.championship_id === championship_id;
    };

    const filterScoresByMatchId = match_id => e => {
        return e.match_id === match_id;
    };

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
                    match => <Score key={match.match_id} score={scores.filter(filterScoresByMatchId(match.match_id))}></Score>
                )}
            </ContainerScores>
        );
    };

    const renderLoading = loading => {
        if (loading) return <Loading/>
        return null;
    };

    // HANDLES ######################################################################################################################################
    const handleShowedChampionshipsId = championship_id => {
        if (showedChampionshipsId.indexOf(championship_id) > -1) { // OBTIENE EL INDICE DEL ELEMENTO, SI NO ENCUENTRA EL ELEMENTO RETORNA -1 ########
            setShowedChampionshipsId(showedChampionshipsId.filter(e => e !== championship_id)) // ELIMINA EL ELEMENTO DEL STATE #####################
        } else {
            setShowedChampionshipsId([...showedChampionshipsId, championship_id]); // AGREGA EL ELEMENTO AL STATE ###################################
        };
    };

    /*JSX ###########################################################################################################################################*/ 
    return (
        <Container.Basic>
            {renderLoading(loading)}
            {renderSelectPlayers(players)}
            {renderDivChampionships(championships)}
        </Container.Basic>
    );
};

export default PlayerResult;