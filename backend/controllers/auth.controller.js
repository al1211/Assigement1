import User from "../models/User.models.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import jwtsecret from "../config/var.js"




 // Singup User
 const SingupUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body;

        // check if user is exist

        const userExits=await User.findOne({email});

        if(userExits){
            return  res.status(400).json({message:"User is already exists"})
        }

        // Hash password
          const hashPassword=await bcrypt.hash(password,10)

        // create User
        await User.create({
            name,
            email,
            password:hashPassword
        });
        res.status(201).json({message:"User registered succesfully"});



    }catch(err){
        res.status(500).json("Internal Server Error",err)

    }
}



// Login User

const Login =async(req,res)=>{
    try{
         const {email,password}=req.body;
         if(!email || !password){
            return res.status(401).json({message:"Invalid Credientals"})
         }
          const user=await User.findOne({email});

          if(!user){
            return res.status(400).json({message:"User not found"})
          }

          // compared password
          const isPasswordValid=await bcrypt.compare(password,user.password);
          if(!isPasswordValid){
            return res.status(400).json({message:"Invalid Credientals"})
          }

          const token=jwt.sign(
            {id:user._id},
            jwtsecret.jwtsecret,
            {expiresIn:"1d"}
          )
         res.status(200).json({
            message:"Login Succesfully",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
         })
    }catch(err){
        return res.status(500).json({message:"Internal Server error"})
    }
}


export const authController={SingupUser,Login}