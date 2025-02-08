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

// to parse the incoming request with JSON payloads
app.use(express.json());
// to parse the cookie
app.use(cookieParser());
// since both fronend and backend were running on different ports, we need to enable cors
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, ()=>{
    console.log("Server is running on PORT:"+PORT);
    connectDB();
});