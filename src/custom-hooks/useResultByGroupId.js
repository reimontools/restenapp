import { useState, useEffect } from 'react';
import * as playerResultService from '../services/result.service'

export const useResultByGroupId = (inGroupId, inToggle) => {
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(true);
    const [groupId, setGroupId] = useState(0);

    const fetchResultByGroupId = async groupId => {
        if (!groupId) return setLoading(false);
        setLoading(true);
        const result = await playerResultService.getResultsByPlayerIdByGroupId(undefined, groupId);
        setResult(result);
        setLoading(false);
    };

    useEffect(() => {
        fetchResultByGroupId(groupId || inGroupId);
    }, [inGroupId, groupId, inToggle]);

    return { result, setGroupId, loading };
        
};