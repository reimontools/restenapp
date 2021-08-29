import axios from '../config/axios';

export const getTokenDataByCredentials = async credentials => {
    try {
        const result = await axios.post("auth/login", credentials);
        return result.data;
    } catch(err) {
        console.log('Err: ' + err);
    };
};