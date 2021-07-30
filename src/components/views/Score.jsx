import { ContainerStyled, ContainerMatchState, ContainerPlayerName, ContainerPlayer, ContainerPlayerPoints, ContainerPlayerScore } from "../styled/Score.styled";
import { Simbol, Line } from "../../component";

const Score = ({score}) => {

    const MatchState = ({score}) => {
        return ( 
            <ContainerMatchState>
                {score[0].match_state_name}
                {score[0].match_state_id === 2 ?<Simbol.Check /> :<Simbol.Point />}
            </ContainerMatchState>
        );
    };

    const PlayerWinner = ({score, index}) => {
        return ( 
            <ContainerPlayerName>
                {score[index]?.player_fullname}
                {score[index].player_id === score[0].player_winner_id && <Simbol.Star />}
            </ContainerPlayerName>
        );
    };

    const getColorByMatchStateId = matchStateId => {
        return matchStateId === 2 ?"#008000" :"#0e70b8";
    };
    
    const renderScore = ({score}) => {
        if(!score[0]?.player_id) return null;
        const color = getColorByMatchStateId(score[0].match_state_id); 
        return (
            <ContainerStyled color={color}>
                <MatchState score={score} />
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
            </ContainerStyled>
        );
    };

    // JSX ##########################################################################################################################################
    return renderScore({score});
};

export default Score;