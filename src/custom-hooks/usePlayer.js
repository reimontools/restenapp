import { useState, useEffect } from 'react';
import { getList } from '../helpers/list.helper';

export const usePlayer = (type, payload) => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        switch(type) {
            case "fetchPlayers":
                fetchPlayers();;
                break;
            default:
                setLoading(false);
                break;
        };
    }, [type, payload]);

    const fetchPlayers = async () => {
        setLoading(true);
        const players = await getList("player");
        setPlayers(players);
        setLoading(false);
    };

    return {
        players,
        fetchPlayers,
        loading
    };
};