import { useState, useEffect } from 'react';
import { getList } from '../helpers/list.helper';

export const useGender = (type, payload) => {
    const [genders, setGenders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        switch(type) {
            case "fetchGenders":
                fetchGenders();;
                break;
            default:
                setLoading(false);
                break;
        };
    }, [type, payload]); 

    const fetchGenders = async () => {
        setLoading(true);
        const genders = await getList("list/gender");
        setGenders(genders);
        setLoading(false);
    };

    return {
        genders,
        loading
    };
};