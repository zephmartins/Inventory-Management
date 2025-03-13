import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"



const loginStatus = asyncHandler(async (req,res) => {
    const token = req.cookies.token;
    if(!token){
        return res.json(false)
    }
        // verify token
     const verify = jwt.verify(token, process.env.JWT_SECRET)

     if(verify){
        return res.json(true)
     }else{
        return res.json(false)
     }

})






export default loginStatus