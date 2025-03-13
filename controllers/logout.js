import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const logout = asyncHandler( async(req,res)=>{
    res.cookie("token", "", {
        path:"/",
        httpOnly: true,
        expires: new Date(0), // 1 day
        sameSite: "none",
        secure: true
    
    })
    return res.status(200).json({message:"Successfully Logged out"})
})


export default logout