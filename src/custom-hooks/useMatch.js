import { useState, useEffect } from 'react';
import { getList } from '../helpers/list.helper';

export const useMatch = (type, payload) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        switch(type) {
            case "fetchMatches":
                fetchMatches();
                break;
            case "fetchMatchesByGroupId":
                fetchMatchesByGroupId(payload);
                break;
            case "fetchMatchesByPlayerId":
                fetchMatchesByPlayerId(payload);
                break;
            default: 
                break;
        };
    }, [type, payload]); 

    const fetchMatches = async () => {
        setLoading(true);
        const matches = await getList("match");
        setMatches(matches);
        setLoading(false);
    };

    const fetchMatchesByGroupId = async group_id => {
        setLoading(true);
        const matches = await getList("match/group/" + group_id);
        setMatches(matches);
        setLoading(false);
    };

    const fetchMatchesByPlayerId = async player_id => {
        setLoading(true);
        const matches = await getList("match/player/" + player_id);
        setMatches(matches);
        setLoading(false);
    };

    return {
        matches,
        fetchMatches,
        fetchMatchesByPlayerId,
        fetchMatchesByGroupId,
        loading
    };
};