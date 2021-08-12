import { useState, useEffect } from 'react';
import { getList } from '../helpers/list.helper';

export const useChampionshipType = (type, payload) => {
    const [championshipTypes, setChampionshipTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        switch(type) {
            case "fetchChampionshipTypes":
                fetchChampionshipTypes();
                break;
            default:
                setLoading(false);
                break;
        };
    }, [type, payload]); 

    const fetchChampionshipTypes = async () => {
        setLoading(true);
        const championshipsTypes = await getList("list/championship_type/");
        setChampionshipTypes(championshipsTypes);
        setLoading(false);
    };

    return {
        championshipTypes,
        loading
    };
};