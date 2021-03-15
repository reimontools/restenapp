import axios from "axios";

const Axios = axios.create({
    // baseURL: process.env.REACT_APP_API_URL
    // baseURL: "http://localhost:4000/"
    // baseURL: "http://18.234.132.175:4000/"
    baseURL: "https://rfsoftdev.xyz/"
});

export default Axios;