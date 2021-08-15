import { useParams, useHistory } from 'react-router-dom';
import { useState } from "react";
import { filterScoresByMatchId } from "../../helpers/filter.helper";
import { Container, Message, Loading, Title, ButtonFloat, DropDownButtonFloat, Dialog } from "../component.controls";
import { ScoreToShow, ScoreToUpdate, Search } from "../component.pieces";
import useModal from "../../hooks/useModal";
import axios from '../../config/axios';
import { useSocket } from "../../custom-hooks/useSocket";
import { useResultByGroupId } from '../../custom-hooks/useResultByGroupId';
import { MSG_NO_MATCH } from "../../helpers/parameters.helper";

const Match = () => {
    const history = useHistory();

    // USE PARAM ####################################################################################################################################
    const { prm_championship_id, prm_championship_type_id, prm_group_id } = useParams();

    // CUSTOM HOOKS #################################################################################################################################
    const {socketToggle, socketEmit} = useSocket('server:score');
    const [result, fetchResultByGroupId, loadingResult] = useResultByGroupId(prm_group_id, socketToggle);
    
    // USE STATE ####################################################################################################################################
    const [searchTerm, setSearchTerm] = useState("");
    const [currentScore, setCurrentScore] = useState([]);

    // DIALOG #######################################################################################################################################
    const [dialogOptions, setDialogOptions] = useState({});

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
            if (res.data.result.cod === 0) return fetchResultByGroupId(group_id);
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
            if (res.data.result.cod === 0) return fetchResultByGroupId(group_id);
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
            if (res.data.result.cod === 0) return fetchResultByGroupId(group_id);
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
        setDialogOptions({
            family: "question", 
            title: 'Redo randomly', 
            text: 'Are you sure you want to redo this group of matches randomly?', 
            subtext: 'Current matches will be overwritten!',
            action: () => initMatchRandomByGroupId(prm_group_id)
        });
    };

    const handleInitMatchOrderByGroupId = () => {
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

    const renderTitle = firtMatch => {
        const titleText = firtMatch.championship_name + " > " + firtMatch.group_name + " > Matches";
        return <Title.Basic flexJustifyContent="flex-start" margin="13px 0 7px 0" width="90%">{titleText}</Title.Basic>;
    };

    const renderResult = result => {
        if (!result.matches) return null;
        if (result.matches.length === 0) return <Message text={MSG_NO_MATCH} />
        return (
            <Container.Primary>
                {renderTitle(result.matches[0])}
                <Search value={searchTerm} action={setSearchTerm} placeholder="By Player Name or State*"/>
                <Container.FlexWrap>
                    {result.matches.map(match => {
                        const score = result.scores.filter(filterScoresByMatchId(match.match_id));
                        return <ScoreToShow key={match.match_id} score={score} action={showModalScoreToUpdate} />
                    })}
                </Container.FlexWrap>
            </Container.Primary>
        );
    };

    // JSX ##########################################################################################################################################
    return (
        <>
            {loadingResult ?<Loading/> :renderResult(result)}

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
