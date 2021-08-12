import { useState, useEffect } from 'react';
import { getList } from '../helpers/list.helper';

export const useUserPlayer = (type, payload) => {
    const [userPlayers, setUserPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        switch(type) {
            case "fetchUserPlayersByUserId":
                fetchUserPlayersByUserId(payload);
                break;
            default:
                setLoading(false);
                break;
        };
    }, [type, payload]); 

    const fetchUserPlayersByUserId = async user_id => {
        setLoading(true);
        const userPlayers = await getList("user-player/" + user_id);
        setUserPlayers(userPlayers);
        setLoading(false);
    };

    return {
        userPlayers,
        fetchUserPlayersByUserId,
        loading
    };
};