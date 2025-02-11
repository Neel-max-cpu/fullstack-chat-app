import axios from "axios";

export const axiosInstance = axios.create({
    // in the production "whatever the url/api"
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "https://socialchatappbackend.vercel.app/api",
    // send cookies with all the request -- so wihtcredentials is set to true
    withCredentials: true, 
});