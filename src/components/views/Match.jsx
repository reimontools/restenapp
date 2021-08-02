import { useParams, useHistory } from 'react-router-dom';
import { useState, useEffect, useCallback } from "react";
import { getList } from '../../helpers/list.helper';
import { filterScoresByMatchId } from "../../helpers/filter.helper";
import { Input, Container, Loading, Title, ButtonFloat, DropDownButtonFloat, Dialog } from "../../component.controls";
import { ScoreToShow, ScoreToUpdate } from "../../component.pieces";
import useModal from "../../hooks/useModal";
import axios from '../../config/axios';

const Match = () => {
    const { prm_championship_id, prm_championship_type_id, prm_group_id } = useParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [matches, setMatches] = useState([]);
    const [scores, setScores] = useState([]);
    const [currentScore, setCurrentScore] = useState([]);

    const history = useHistory();

    // DIALOG #######################################################################################################################################
    const [dialogOptions, setDialogOptions] = useState({});

    /*FETCH ###########################################################################################*/
    const fetchMatchesByGroupId = async group_id => {
        const res = await getList("match/" + group_id);
        setMatches(res);
    };
    const fetchScoresByGroupId = async group_id => {
        const res = await getList("score/" + group_id);
        setScores(res);
    };
    const fetchMatchesScores = useCallback(() => {
        setLoading(true);
        fetchMatchesByGroupId(prm_group_id);
        fetchScoresByGroupId(prm_group_id);
        setLoading(false);
    }, [prm_group_id])

    /*EFFECT #########################################################################################*/
    useEffect(() => {
        fetchMatchesScores();
    }, [fetchMatchesScores]);

    // MODAL ########################################################################################################################################
    const [isOpenModalScoreToUpdate, openModalScoreToUpdate, closeModalScoreToUpdate] = useModal();
    const showModalScoreToUpdate = score => {
        setCurrentScore(score);
        openModalScoreToUpdate();
    };

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
                {loading
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
            <ScoreToUpdate score={currentScore} setScore={setCurrentScore} fetch={fetchMatchesScores} isOpen={isOpenModalScoreToUpdate} close={closeModalScoreToUpdate} />
                
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
