import axios from '../config/axios';

export const getResultsByPlayerId = async player_id => {
    try {
        const result = await axios.get("result/player/" + player_id);
        return result.data.result;
    } catch(err) {
        console.log('Err: ' + err);
    };
};

export const getResultsByGroupId = async group_id => {
    try {
        const result = await axios.get("result/group/" + group_id);
        return result.data.result;
    } catch(err) {
        console.log('Err: ' + err);
    };
};