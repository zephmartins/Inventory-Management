import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken"


const generateToken =  (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,{expiresIn: "1d"})
}
// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  if (password.length < 8) {
    res.status(400);
    throw new Error("Password must be up to 8 characters");
  }

  // Check if user email already exist
  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(404);
    throw new Error("Email has already been registered");
  }




  // create new user
  const user = await User.create({
    name,
    email,
    password,
    phone
  });


  // Generate a Token
const token = generateToken(user._id)

// Send Http-Only-Cookie
res.cookie("token", token, {
    path:"/",
    httpOnly: true,
    expires: new Date(Date.now()+ 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true

})

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      phone: user.phone,
      bio: user.bio,
      token: token
   
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});



 export default registerUser
