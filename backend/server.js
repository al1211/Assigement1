import express from "express";
import cors from "cors";
import config from "./config/var.js"
import { ConnectDb } from "./config/db.js";
import authRoute from "./routes/auth.routes.js";
import TaskRoute from "./routes/task.routes.js";

const app=express();


const PORT=config.port;
 
app.use(cors());
app.use(express.json())

ConnectDb();

app.use("/api/v1/auth",authRoute);
app.use("/api/v1/task",TaskRoute)
app.get("/health",(req,res)=>{
    res.send("server is running")
})

app.listen(PORT,()=>{
    console.log(`server is listen ${PORT}`)
})