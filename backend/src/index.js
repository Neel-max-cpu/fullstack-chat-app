import express from 'express';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from "cors";


// for deployment --- render(not vercel)
// import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { app, server } from './lib/socket.js';

dotenv.config();
// for http rest api ---
// const app = express();

// for socket.io -- comming for the file lib/socket.js



const PORT = process.env.PORT;
// for deployment --- render(not vercel)
// const __dirname = path.resolve();

app.use(cors({
    // origin: "http://localhost:5173",
    origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
    credentials: true,
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
}));
// to parse the incoming request with JSON payloads
// app.use(express.json());
// Increase payload size limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// to parse the cookie
app.use(cookieParser());
// since both fronend and backend were running on different ports, we need to enable cors


// for deployment --- render/(not vercel)
/*
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    // if we go any route(*=anyroute) inside dist then we would like our react application 
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}
*/


// default routes
app.get("/", (req, res)=>{
    res.json("hello!");
})
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// app.listen(PORT, ()=>{
server.listen(PORT, () => {
    console.log("Server is running on PORT:" + PORT);
    connectDB();
});