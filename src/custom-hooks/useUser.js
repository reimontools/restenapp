import { useState, useEffect } from 'react';
import { getList } from '../helpers/list.helper';

export const useUser = (type, payload) => {
    const [users, setusers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        switch(type) {
            case "fetchUsers":
                fetchUsers();
                break;
            default:
                setLoading(false);
                break;
        };
    }, [type, payload]); 

    const fetchUsers = async () => {
        setLoading(true);
        const users = await getList("user");
        setusers(users);
        setLoading(false);
    };

    return {
        users,
        fetchUsers,
        loading
    };
};