import jwt from "jsonwebtoken"
import jwtsecret from "../config/var.js"
export const authMiddleware = (req, res, next) => {
    try {
        const authtoken = req.headers.authorization;
        if (!authtoken) {
            return res.status(401).json({
                success: false,
                message: "Token not provided"
            });
        }
        const token = authtoken.split(" ")[1];
        const verify = jwt.verify(token,process.env.JWT_SECRET);
        if (!verify) {
            return res.status(403).json({
                success: false,
                message: "Authentication failed"
            })
        }
        req.user = verify;
        next();

    } catch (err) {
        console.log("error", err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}