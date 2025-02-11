import axios from "axios";

export const axiosInstance = axios.create({
    // in the production "whatever the url/api"
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : process.env.BACKEND_URL,
    // send cookies with all the request -- so wihtcredentials is set to true
    withCredentials: true, 
});