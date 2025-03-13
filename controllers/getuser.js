import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";



const getUser = asyncHandler(
    async (req,res) => {
        const user = await User.findById(req.user._id)
        if (user) {
            res.status(200).json({
              _id: user.id,
              name: user.name,
              email: user.email,
              photo: user.photo,
              phone: user.phone,
              bio: user.bio,
           
           
            });
          }else {
            res.status(400);
            throw new Error("Invalid user data");
          }

    }
)




export default getUser