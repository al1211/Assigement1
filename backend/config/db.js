import mongoose from "mongoose"
import db from "./var.js"

export const ConnectDb=async()=>{
    try{

      await mongoose.connect(db.mongoUri);
      console.log("mongoose is connect")
    }catch(err){
       console.error( `Error: ${err.message}`)
    }
}