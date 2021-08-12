import { ContainerScore, ContainerScoreHeader, ContainerMatchState, ContainerMatchGroupName, ContainerPlayerName, ContainerPlayer, ContainerPlayerPoints, ContainerPlayerScore } from "../styled/ScoreToShow.styled";
import { Simbol, Line } from "../component.controls";
import { COLOR_BY_STATE_ID, SIMBOL_TYPE_BY_STATE_ID } from "../../helpers/parameters.helper";

const ScoreToShow = ({score, action}) => {

    const MatchState = ({score, color}) => {
        return ( 
            <ContainerScoreHeader color={color}>
                <ContainerMatchGroupName>
                    {score[0].group_name}
                </ContainerMatchGroupName>
                <ContainerMatchState>
                    {score[0].match_state_name}<Simbol type={SIMBOL_TYPE_BY_STATE_ID[score[0].match_state_id]} />
                </ContainerMatchState>
            </ContainerScoreHeader>
        );
    };

    const PlayerWinner = ({score, index}) => {
        return ( 
            <ContainerPlayerName>
                {score[index].player_fullname}
                {score[index].player_id === score[0].player_winner_id && <Simbol type="star" />}
            </ContainerPlayerName>
        );
    };

    const renderScore = ({score}) => {
        if(!score[0]?.player_id) return null;
        const scoreToCrud = score.map(item => {return {...item}});
        const color = COLOR_BY_STATE_ID[score[0].match_state_id]; 
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