import { useState, useEffect } from 'react';
import { getList } from '../helpers/list.helper'; 

const useList = ruta => {
    const [list, setList] = useState([]);
    useEffect(() => {
        async function fetchData() {
            const res = await getList(ruta);
            setList(res);
        };
        fetchData();
      }, [ruta]); 
    return list;
};

export default useList;