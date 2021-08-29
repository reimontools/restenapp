import { useState, useEffect } from 'react';
import * as playerResultService from '../services/result.service'

export const useResultByPlayerId = (inPlayerId, inToggle) => {
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playerId, setPlayerId] = useState(0);

    const fetchResultByPlayerId = async playerId => {
        if (!playerId) return setLoading(false);
        setLoading(true);
        const result = await playerResultService.getResultsByPlayerIdByGroupId(playerId);
        setResult(result);
        setLoading(false);
    };

    useEffect(() => {
        fetchResultByPlayerId(playerId || inPlayerId);
    }, [inPlayerId, playerId, inToggle]);

    return { result, setPlayerId, loading };
        
};