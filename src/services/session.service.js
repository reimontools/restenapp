// import { useState } from "react";
import axios from '../config/axios';

export const getTokenDataByCredentials = async credentials => {
    try {
        const result = await axios.post("auth/login", credentials);
        return result.data;
    } catch(err) {
        console.log('Err: ' + err);
    };
};

// export const getUserDataByUserId = async user_id => {
//     try {
//         const result = await axios.get("auth/" + user_id);
//         return result.data;
//     } catch(err) {
//         console.log('Err: ' + err);
//     };
// };