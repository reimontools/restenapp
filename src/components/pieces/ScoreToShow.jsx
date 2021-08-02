import { ContainerScore, ContainerScoreHeader, ContainerMatchState, ContainerMatchGroupName, ContainerPlayerName, ContainerPlayer, ContainerPlayerPoints, ContainerPlayerScore } from "../styled/ScoreToShow.styled";
import { Simbol, Line } from "../../component.controls";

const ScoreToShow = ({score, action}) => {

    const MatchState = ({score, color}) => {
        return ( 
            <ContainerScoreHeader color={color}>
                <ContainerMatchGroupName>
                    {score[0].group_name}
                </ContainerMatchGroupName>
                <ContainerMatchState>
                    {score[0].match_state_name}{score[0].match_state_id === 2 ?<Simbol.Check margin="0 0 0 2px"/> :<Simbol.Point margin="0 0 0 2px"/>}
                </ContainerMatchState>
            </ContainerScoreHeader>
        );
    };

    const PlayerWinner = ({score, index}) => {
        return ( 
            <ContainerPlayerName>
                {score[index].player_fullname}
                {score[index].player_id === score[0].player_winner_id && <Simbol.Star margin="0 0 0 2px"/>}
            </ContainerPlayerName>
        );
    };

    const getColorByMatchStateId = matchStateId => {
        return matchStateId === 2 ?"#008000" :"#0e70b8";
    };
    
    const renderScore = ({score}) => {
        if(!score[0]?.player_id) return null;
        const scoreToCrud = score.map(item => {return {...item}});
        const color = getColorByMatchStateId(score[0].match_state_id); 
        return (
            <ContainerScore color={color} onClick={() => action(scoreToCrud)}>
                <MatchState color={color} score={score} />
                <ContainerPlayer>
                    <ContainerPlayerName>Set</ContainerPlayerName>
                    <ContainerPlayerScore>
                        <ContainerPlayerPoints>{score[0]?.set_number}</ContainerPlayerPoints>
                        <ContainerPlayerPoints>{score[1]?.set_number}</ContainerPlayerPoints>
                        <ContainerPlayerPoints>{score[2]?.set_number}</ContainerPlayerPoints>
                    </ContainerPlayerScore>
                </ContainerPlayer>
                <Line.Basic color={color} />
                <ContainerPlayer>
                    <PlayerWinner score={score} index={0}/>
                    <ContainerPlayerScore>
                        <ContainerPlayerPoints>{score[0]?.point}</ContainerPlayerPoints>
                        <ContainerPlayerPoints>{score[1]?.point}</ContainerPlayerPoints>
                        <ContainerPlayerPoints>{score[2]?.point}</ContainerPlayerPoints>
                    </ContainerPlayerScore>
                </ContainerPlayer>
                <ContainerPlayer>
                    <PlayerWinner score={score} index={3}/>
                    <ContainerPlayerScore>
                        <ContainerPlayerPoints>{score[3]?.point}</ContainerPlayerPoints>
                        <ContainerPlayerPoints>{score[4]?.point}</ContainerPlayerPoints>
                        <ContainerPlayerPoints>{score[5]?.point}</ContainerPlayerPoints>
                    </ContainerPlayerScore>
                </ContainerPlayer>
            </ContainerScore>
        );
    };

    // JSX ##########################################################################################################################################
    return renderScore({score});
};

export default ScoreToShow;