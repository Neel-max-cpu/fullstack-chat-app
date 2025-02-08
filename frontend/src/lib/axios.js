import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:5001/api/",
    // send cookies with all the request -- so wihtcredentials is set to true
    withCredentials: true, 
});