import axios from "axios";
import cookie from 'js-cookie';

const Axios = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

Axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    const cookieUser = 'USERINFO';
    var user = cookie.getJSON(cookieUser);
    if (user) {
        config.headers["laweaitamia"] = user.token;
    };
    // console.log("config", config); 
    return config;

    // if (cookie.getJSON('user') !== undefined){
    //     const token = galleta.getJSON('USERINFO').token;
    //     console.log(token);
    //     config.headers["x-access-token"] = token;
    // };
    // return config;
});

export default Axios;
