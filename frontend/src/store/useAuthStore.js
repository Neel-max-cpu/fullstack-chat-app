import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : process.env.BACKEND_URL;

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIng: false,
    isForgetIng: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    // for loading each time we refresh --
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");

            // user is authenticated
            set({ authUser: res.data });

            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth", error);
            // user is not authenticated
            set({ authUser: null });
        } finally {
            // loading false/done
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account Created Successfully!");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    forget: async (data, navigate) =>{        
        set({isForgetIng:true});
        try {
            const res = await axiosInstance.post("/auth/forget", data);            
            toast.success("Password changed successfully, redirecting to login page!")
            setTimeout(() => {
                navigate("/login");
            }, 3000);

            
        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            set({isForgetIng:false});
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in update profile:", error);
            //   toast.error(error.response.data.message);
            toast.error("Profile Pic should be less than 10mb");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        // if there is no authorized user or connection is alread established then return(don't try to create new connection) 
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();

        set({ socket: socket });

        // listen for online users --
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    // if we are connected then only disconnect
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },

}));