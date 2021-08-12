import { useState, useEffect } from 'react';
import { getList } from '../helpers/list.helper';

export const useGroup = (type, payload) => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        switch(type) {
            case "fetchGroupsByChampionshipId":
                fetchGroupsByChampionshipId(payload);;
                break;
            default:
                setLoading(false);
                break;
        };
    }, [type, payload]); 

    const fetchGroupsByChampionshipId = async championship_id => {
        setLoading(true);
        const groups = await getList("group/" + championship_id);
        setGroups(groups);
        setLoading(false);
    };

    return {
        groups,
        fetchGroupsByChampionshipId,
        loading
    };
};