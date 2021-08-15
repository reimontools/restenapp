import { useState, useEffect } from 'react';
import * as playerResultService from '../services/result.service'

export const useResultByGroupId = (groupId, toggle) => {
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentGroupId, setCurrentGroupId] = useState(0);

    const fetchResultByGroupId = async group_id => {
        if (!group_id) return setLoading(false);
        setLoading(true);
        const result = await playerResultService.getResultsByGroupId(group_id);
        setResult(result);
        setLoading(false);
    };

    useEffect(() => {
        setCurrentGroupId(groupId);
    }, [groupId]); 

    useEffect(() => {
        fetchResultByGroupId(currentGroupId);
    }, [toggle, currentGroupId]);

    return [result, fetchResultByGroupId, loading]
        
};