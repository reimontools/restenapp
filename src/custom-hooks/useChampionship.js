import { useState, useEffect } from 'react';
import { getList } from '../helpers/list.helper';

export const useChampionship = (type, payload) => {
    const [championships, setChampionships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        switch(type) {
            case "fetchChampionships":
                fetchChampionships();
                break;
            case "fetchChampionshipsByPlayerId":
                fetchChampionshipsByPlayerId(payload);
                break;
            default: 
                break;
        };
    }, [type, payload]); 
    
    const fetchChampionships = async () => {
        setLoading(true);
        const championships = await getList("championship");
        setChampionships(championships);
        setLoading(false);
    };

    const fetchChampionshipsByPlayerId = async player_id => {
        setLoading(true);
        const championships = await getList("championship/player/" + player_id);
        setChampionships(championships);
        setLoading(false);
    };

    return {
        championships,
        fetchChampionships,
        fetchChampionshipsByPlayerId,
        loading
    };
};