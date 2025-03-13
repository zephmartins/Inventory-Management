import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const generateToken =  (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,{expiresIn: "1d"})
}

//Login User
const loginUser = asyncHandler( async (req,res) =>{
const {email,password} = req.body;

// Validate Request
    if(!email || !password){
        res.status(400);
        throw new Error("Please enter Email and Password");
    }
// Check if user exist
    const user = await User.findOne({email})
    if(!user){
        res.status(400);
        throw new Error("Please Sign Up");
    }
    
    // Check if User Ceredential is correct

    const passwordIsCorrect = await bcrypt.compare(password, user.password)

     // Generate a Token
    const token = generateToken(user._id)

// Send Http-Only-Cookie
if(passwordIsCorrect){
    res.cookie("token", token, {
        path:"/",
        httpOnly: true,
        expires: new Date(Date.now()+ 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true
    
    })
}
    

    if (user && passwordIsCorrect) {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            photo: user.photo,
            phone: user.phone,
            bio: user.bio,
           
         
          })
    } else{
        res.status(400);
        throw new Error("Invalid email or password");
    }

}

)


export default loginUser