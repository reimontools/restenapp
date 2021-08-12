import { useState, useEffect } from 'react';
import { getList } from '../helpers/list.helper';

export const useGroupPlayer = (type, payload) => {
    const [groupPlayers, setGroupPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        switch(type) {
            case "fetchGroupPlayersByGroupId":
                fetchGroupPlayersByGroupId(payload);
                break;
            default:
                setLoading(false);
                break;
        };
    }, [type, payload]); 

    const fetchGroupPlayersByGroupId = async group_id => {
        setLoading(true);
        const groupPlayers = await getList("group-player/" + group_id);
        setGroupPlayers(groupPlayers);
        setLoading(false);
    };

    return {
        groupPlayers,
        fetchGroupPlayersByGroupId,
        loading
    };
};