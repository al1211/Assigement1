import express from "express"
import { authController } from "../controllers/auth.controller.js";
import validate from "../middleware/Validate.middleware.js";
import userRegisterSchema from "../Schema/uesr.Schema.js";

const authRoute=express.Router();

authRoute.post("/singup",validate(userRegisterSchema) ,authController.SingupUser);
authRoute.post("/login",authController.Login);





export default authRoute