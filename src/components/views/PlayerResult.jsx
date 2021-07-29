import { useState, useEffect, useCallback } from "react";
import { Container, Select2, Loading, ButtonCircleIcon } from "../../component";
import { ContainerChampionships, ContainerChampionship, ContainerChampionshipHeader, ContainerScores, ContainerScore } from "../styled/PlayerResult.styled";
import { getList } from '../../helpers/listHelper'; 
import useAppContext from '../../hooks/useAppContext';

const PlayerResult = () => {
    /*CONTEXT #######################################################################################################################################*/ 
    const { user } = useAppContext();

    /*STATE #########################################################################################################################################*/ 
    const [players, setPlayers] = useState("");
    const [championships, setChampionships] = useState("");
    const [currentChampionshipId, setCurrentChampionshipId] = useState(0);
    const [matches, setMatches] = useState([]);
    // const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(false);

    /*FETCHS ########################################################################################################################################*/ 
    const fetchChampionshipsByPlayerId = async player_id => {
        const championships = await getList("player-result/championships/" + player_id);
        setChampionships(championships);
    };

    // const fetchScoresByPlayerId = async player_id => {
    //     const scores = await getList("player-result/scores/" + player_id);
    //     setScores(scores);
    // };

    const fetchMatchesByPlayerId = async player_id => {
        const matches = await getList("player-result/matches/" + player_id);
        setMatches(matches);
    };

    const fetchPlayerResultByPlayerId = useCallback(async player_id => {
        setLoading(true);
        setCurrentChampionshipId(0);
        await fetchChampionshipsByPlayerId(player_id);
        await fetchMatchesByPlayerId(player_id);
        // await fetchScoresByPlayerId(player_id);
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

    // RENDERS ######################################################################################################################################
    const renderSelectPlayers = players => {
        if (players === "") return null;
        if (players.length === 0) return <Container.NoRows>Sorry! you have no players assigned yet, please contact the administrator.</Container.NoRows>
        return <Select2.OnChange label="My players" content={players} action={fetchPlayerResultByPlayerId}/>
    };

    const renderDivChampionships = championships => {
        if (championships === "") return null;
        if (championships.length === 0) return <Container.NoRows>Sorry! this player have no championships assigned yet, please contact the administrator.</Container.NoRows>
        return (
            <ContainerChampionships>
                {championships.map(championship => {
                    const matchesFilteredByChampionshipId = matches.filter(filterMatchesByChampionshipId(championship.championship_id));
                    return (
                        <ContainerChampionship key={championship.championship_id} id={championship.championship_id}>
                            <ContainerChampionshipHeader onClick={() => handleExpand(championship.championship_id)}>
                                <ButtonCircleIcon.Basic family={"add"} margin="0 5px 0 0"/>
                                {championship.championship_name}
                            </ContainerChampionshipHeader>
                            {renderDivMatches(matchesFilteredByChampionshipId)}
                        </ContainerChampionship>
                    );
                })}
            </ContainerChampionships>
        );
    };

    const renderDivMatches = matches => {
        const show = matches[0]?.championship_id === currentChampionshipId ? "show" : "hide";
        return (
            <ContainerScores className={show}>
                {matches.map(match => {
                    return <ContainerScore key={match.match_id}>{match.match_name}</ContainerScore>;
                })}
            </ContainerScores>
        );
    };

    const renderLoading = loading => {
        if (loading) return <Loading/>
        return null;
    };

    // HANDLES ######################################################################################################################################
    const handleExpand = championship_id => {
        championship_id === currentChampionshipId ? setCurrentChampionshipId(0) : setCurrentChampionshipId(championship_id);
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