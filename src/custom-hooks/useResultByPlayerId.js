import { useState, useEffect } from 'react';
import * as playerResultService from '../services/result.service'

export const useResultByPlayerId = (playerId, toggle) => {
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPlayerId, setCurrentPlayerId] = useState(0);

    const fetchResultByPlayerId = async player_id => {
        if (!player_id) return setLoading(false);
        setLoading(true);
        const result = await playerResultService.getResultsByPlayerId(player_id);
        setResult(result);
        setLoading(false);
    };

    useEffect(() => {
        setCurrentPlayerId(playerId);
    }, [playerId]); 

    useEffect(() => {
        fetchResultByPlayerId(currentPlayerId);
    }, [toggle, currentPlayerId]);

    return [result, fetchResultByPlayerId, loading]
        
};