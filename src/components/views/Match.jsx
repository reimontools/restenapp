import { useParams, useHistory } from 'react-router-dom';
import { useState, useEffect } from "react";
import { filterScoresByMatchId } from "../../helpers/filter.helper";
import { Input, Container, Loading, Title, ButtonFloat, DropDownButtonFloat, Dialog } from "../component.controls";
import { ScoreToShow, ScoreToUpdate } from "../component.pieces";
import useModal from "../../hooks/useModal";
import axios from '../../config/axios';
import { useMatch } from '../../custom-hooks/useMatch';
import { useScore } from '../../custom-hooks/useScore';
import { useSocket } from "../../custom-hooks/useSocket";

const Match = () => {
    const history = useHistory();

    // USE PARAM ####################################################################################################################################
    const { prm_championship_id, prm_championship_type_id, prm_group_id } = useParams();

    // CUSTOM HOOKS #################################################################################################################################
    const {matches, fetchMatchesByGroupId, loading: loadingMatches} = useMatch("fetchMatchesByGroupId", prm_group_id);
    const {scores, fetchScoresByGroupId, loading: loadingScores} = useScore("fetchScoresByGroupId", prm_group_id);
    const {socketToggle, socketEmit} = useSocket('server:score');

    const [searchTerm, setSearchTerm] = useState("");
    const [currentScore, setCurrentScore] = useState([]);

    // DIALOG #######################################################################################################################################
    const [dialogOptions, setDialogOptions] = useState({});

    /*FETCH ###########################################################################################*/
    const fetchMatchesScores = async () => {
        await fetchMatchesByGroupId(prm_group_id);
        await fetchScoresByGroupId(prm_group_id);
    };

    // MODAL ########################################################################################################################################
    const [isOpenModalScoreToUpdate, openModalScoreToUpdate, closeModalScoreToUpdate] = useModal();
    const showModalScoreToUpdate = score => {
        setCurrentScore(score);
        openModalScoreToUpdate();
    };

    // USE EFFECT ###################################################################################################################################
    useEffect(() => {
        fetchMatchesScores();
        // eslint-disable-next-line
    }, [socketToggle]);

    // CRUD #########################################################################################################################################
    const initMatchRandomByGroupId = async group_id => {
        try {
            const res = await axios.post("match/random/", {group_id});
            if (res.data.result.cod === 0) return fetchMatchesScores();
            setDialogOptions({
                family: "info", 
                title: 'Alert', 
                text : 'Error: ' + res.data.result.msg
            });
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const initMatchOrderByGroupId = async group_id => {
        try {
            const res = await axios.post("match/ordened/", {group_id});
            if (res.data.result.cod === 0) return fetchMatchesScores();
            setDialogOptions({
                family: "info", 
                title: 'Alert', 
                text : 'Error: ' + res.data.result.msg
            });
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const initMatchAgainstByGroupId = async group_id => {
        try {
            const res = await axios.post("match/against/", {group_id});
            if (res.data.result.cod === 0) return fetchMatchesScores();
            setDialogOptions({
                family: "info", 
                title: 'Alert', 
                text : 'Error: ' + res.data.result.msg
            });
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    // HANDLES ######################################################################################################################################
    const handleGoBack = e => {
        e.stopPropagation();
        history.push('/championship/group/' + prm_championship_id + '/' + prm_championship_type_id);
    };

    const handleInitMatchRandomByGroupId = () => {
        // e.stopPropagation();
        setDialogOptions({
            family: "question", 
            title: 'Redo randomly', 
            text: 'Are you sure you want to redo this group of matches randomly?', 
            subtext: 'Current matches will be overwritten!',
            action: () => initMatchRandomByGroupId(prm_group_id)
        });
    };

    const handleInitMatchOrderByGroupId = () => {
        // e.stopPropagation();
        setDialogOptions({
            family: "question", 
            title: 'Redo in order', 
            text: 'Are you sure you want to redo this group of matches in order?', 
            subtext: 'Current matches will be overwritten!',
            action: () => initMatchOrderByGroupId(prm_group_id)
        });
    };

    const handleInitMatchAgainstByGroupId = () => {
        setDialogOptions({
            family: "question", 
            title: 'Redo all against all', 
            text: 'Are you sure you want to redo this group of matches "all against all"?', 
            subtext: 'Current matches will be overwritten!',
            action: () => initMatchAgainstByGroupId(prm_group_id)
        });
    };

    // RENDERS ######################################################################################################################################
    const renderDropDownButtonFloat = () => {
        return (
            <DropDownButtonFloat.Basic family="moreFloat" bottom="65px">
                <div className="content" onClick={() => handleInitMatchRandomByGroupId()}>Redo randomly</div>
                <div className="content" onClick={() => handleInitMatchOrderByGroupId()}>Redo according to order</div>
                <div className="content" onClick={() => handleInitMatchAgainstByGroupId()}>Redo all Against all</div>
            </DropDownButtonFloat.Basic>
        );
    };

    // JSX ##########################################################################################################################################
    return (
        <>
            <Container.Primary>
                {/* <Title.Basic fontSize="20px">{matches[0]?.championship_name}</Title.Basic>
                <Title.Basic>{matches[0]?.group_name}</Title.Basic> */}
                <Title.Basic fontSize="20px">Matches</Title.Basic> 
                <div className="search-container">
                    <Input.TextAction name="search" placeholder="Search..." value={searchTerm} action={setSearchTerm} />
                </div>
                {loadingMatches || loadingScores
                    ? <Loading/>
                    : <Container.FlexWrap>
                        {matches.map(match => {
                            const score = scores.filter(filterScoresByMatchId(match.match_id));
                            return <ScoreToShow key={match.match_id} score={score} action={showModalScoreToUpdate} />
                        })}
                    </Container.FlexWrap>
                }
            </Container.Primary>

            {/* SCORE TO UPDATE ##################################################################################################################### */}
            <ScoreToUpdate 
                score={currentScore} 
                setScore={setCurrentScore}
                socketEmit={socketEmit}
                isOpen={isOpenModalScoreToUpdate} 
                close={closeModalScoreToUpdate}
                title="Updating Score"
                isCleanable={true}
                isEditable={true}
                isSaveable={true}
                isAcceptable={false}     
            />
                
            {/* BUTTON BACK ######################################################################################################################### */}
            <ButtonFloat.Icon onClick={e => handleGoBack(e)} hover family="backFloat" />

            {/* BUTTON OPTIONS ###################################################################################################################### */}
            {renderDropDownButtonFloat()}

            {/* DIALOG  ############################################################################################################################# */}
            <Dialog.Action options={dialogOptions} close={() => setDialogOptions({})} />
        </>
    );
};
export default Match;
