import express from 'express';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from "cors";

import {connectDB} from "./lib/db.js";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"

dotenv.config();
const app = express();


const PORT = process.env.PORT;

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods: 'GET, POST, PUT, DELETE',  
    allowedHeaders: 'Content-Type, Authorization',
}));
// to parse the incoming request with JSON payloads
// app.use(express.json());
// Increase payload size limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb"}));
// to parse the cookie
app.use(cookieParser());
// since both fronend and backend were running on different ports, we need to enable cors



app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, ()=>{
    console.log("Server is running on PORT:"+PORT);
    connectDB();
});