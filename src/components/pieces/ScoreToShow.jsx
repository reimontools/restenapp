import { ContainerScore, ContainerScoreHeader, ContainerMatchState, ContainerMatchGroupName, ContainerPlayerName, ContainerPlayer, ContainerPlayerPoints, ContainerPlayerScore } from "../styled/ScoreToShow.styled";
import { Simbol, Line } from "../component.controls";
import { COLOR_BY_STATE_ID, SIMBOL_TYPE_BY_STATE_ID } from "../../helpers/parameters.helper";

const ScoreToShow = ({scores, action}) => {

    const MatchState = ({scores, color}) => {
        return ( 
            <ContainerScoreHeader color={color}>
                <ContainerMatchGroupName>
                    {scores[0].group_name}
                </ContainerMatchGroupName>
                <ContainerMatchState>
                    {scores[0].match_state_name}<Simbol type={SIMBOL_TYPE_BY_STATE_ID[scores[0].match_state_id]} />
                </ContainerMatchState>
            </ContainerScoreHeader>
        );
    };

    const PlayerWinner = ({scores, index}) => {
        return ( 
            <ContainerPlayerName>
                {scores[index].player_fullname}
                {scores[index].player_id === scores[0].player_winner_id && <Simbol type="star" />}
            </ContainerPlayerName>
        );
    };

    const renderScores = ({scores}) => {
        if(!scores[0]?.player_id) return null;
        const scoreToCrud = scores.map(item => {return {...item}});
        const color = COLOR_BY_STATE_ID[scores[0].match_state_id]; 
        return (
            <ContainerScore color={color} onClick={() => action(scoreToCrud)}>
                <MatchState color={color} scores={scores} />
                <ContainerPlayer>
                    <ContainerPlayerName>Set</ContainerPlayerName>
                    <ContainerPlayerScore>
                        <ContainerPlayerPoints>{scores[0]?.set_number}</ContainerPlayerPoints>
                        <ContainerPlayerPoints>{scores[1]?.set_number}</ContainerPlayerPoints>
                        <ContainerPlayerPoints>{scores[2]?.set_number}</ContainerPlayerPoints>
                    </ContainerPlayerScore>
                </ContainerPlayer>
                <Line.Basic color={color} />
                <ContainerPlayer>
                    <PlayerWinner scores={scores} index={0}/>
                    <ContainerPlayerScore>
                        <ContainerPlayerPoints>{scores[0]?.point}</ContainerPlayerPoints>
                        <ContainerPlayerPoints>{scores[1]?.point}</ContainerPlayerPoints>
                        <ContainerPlayerPoints>{scores[2]?.point}</ContainerPlayerPoints>
                    </ContainerPlayerScore>
                </ContainerPlayer>
                <ContainerPlayer>
                    <PlayerWinner scores={scores} index={3}/>
                    <ContainerPlayerScore>
                        <ContainerPlayerPoints>{scores[3]?.point}</ContainerPlayerPoints>
                        <ContainerPlayerPoints>{scores[4]?.point}</ContainerPlayerPoints>
                        <ContainerPlayerPoints>{scores[5]?.point}</ContainerPlayerPoints>
                    </ContainerPlayerScore>
                </ContainerPlayer>
            </ContainerScore>
        );
    };

    // JSX ##########################################################################################################################################
    return renderScores({scores});
};

export default ScoreToShow;