import mongoose from "mongoose";
import { minLength } from "zod";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true,"Name is required"],
        trim:true,
        minLength:[2,"Name must be at least 2 characters"],
        maxlength: [50, "Name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true,"Email is required"],
        unique: true,
        trim:true,
    },
    password: {
        type: String,
        required: [true,"Password is required"],
        minLength:[6,"Password must be at least 6 characters"]
    },
    role: {
        type: String,
        enum: {
           values: ['user', 'admin'],
           message:"Role must be either user or admin"
        },
        default: 'user' 
    }
}, { timestamps: true });


export default mongoose.model("User",userSchema);   