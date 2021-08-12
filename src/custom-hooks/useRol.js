import { useState, useEffect } from 'react';
import { getList } from '../helpers/list.helper';

export const useRol = (type, payload) => {
    const [rols, setRols] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        switch(type) {
            case "fetchRols":
                fetchRols();
                break;
            default:
                setLoading(false);
                break;
        };
    }, [type, payload]);

    const fetchRols = async () => {
        setLoading(true);
        const rols = await getList("list/rol");
        setRols(rols);
        setLoading(false);
    };

    return {
        rols,
        loading
    };
};