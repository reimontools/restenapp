import axios from '../config/axios';

export const getResultsByPlayerIdByGroupId = async (playerId = "*", groupId = "*") => {
    try {
        const result = await axios.get("result/" + playerId + "/" + groupId);
        return result.data.result;
    } catch(err) {
        console.log('Err: ' + err);
    };
};