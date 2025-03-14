import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken"




const protect = asyncHandler(async (req,res,next) => {
    try {
        const token = req.cookies.token
        if(!token){
            res.status(401)
            throw new Error("Not authorized, please login");
        }
            // Verify token
        const verify = jwt.verify(token, process.env.JWT_SECRET)

        // Get Userid from Token
       const user = await User.findById(verify.id).select("-password")

       if(!user){
        res.status(401)
            throw new Error("User not found");
            
       }

      
     
      req.user = user
      
      

        next()
       
    } catch (error) {
        res.status(401)
            throw new Error("Not authorized, please login");
    }
})

export default protect