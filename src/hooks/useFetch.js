import { useState, useEffect } from 'react';
import { getList } from '../helpers/list.helper';

export const useFetch = (route = null) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(route) {
            fetchDataByRoute(route)
        };
    }, [route]);
    
    const fetchDataByRoute = async route => {
        setLoading(true);
        const data = await getList(route);
        setData(data);
        setLoading(false);
    };

    return {
        data,
        fetchDataByRoute,
        loading
    };
};