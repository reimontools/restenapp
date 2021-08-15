import { useState, useEffect } from 'react';
import { getList } from '../helpers/list.helper';

export const useScore = (type, payload) => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        switch(type) {
            case "fetchScores":
                fetchScores();
                break;
            case "fetchScoresByPlayerId":
                fetchScoresByPlayerId(payload);
                break;
            case "fetchScoresByGroupId":
                fetchScoresByGroupId(payload);
                break;
            default: 
                setLoading(false);
                break;
        };
    }, [type, payload]); 

    const fetchScores = async () => {
        setLoading(true);
        const scores = await getList("score/");
        setScores(scores);
        setLoading(false);
    };

    const fetchScoresByPlayerId = async player_id => {
        setLoading(true);
        const scores = await getList("score/player/" + player_id);
        setScores(scores);
        setLoading(false);
    };

    const fetchScoresByGroupId = async group_id => {
        setLoading(true);
        const scores = await getList("score/group/" + group_id);
        setScores(scores);
        setLoading(false);
    };

    return {
        scores,
        fetchScores,
        fetchScoresByPlayerId,
        fetchScoresByGroupId,
        loading
    };
};