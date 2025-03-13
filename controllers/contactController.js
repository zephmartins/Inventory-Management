import asyncHandler from "express-async-handler"
import User from "../models/userModel.js";
import sendEmail from "../utils/sendemail.js";



const contactUs = asyncHandler(async (req,res) => {
   const {subject,message} = req.body;
   const user = User.findById(req.user._id);

   if(!user){
    res.status(400)
    throw new Error("User not found please sign up");
   }

   // Validation

   if(!subject || !message){
    res.status(400)
    throw new Error("Please add subject and message");
   }
   const send_to = process.env.EMAIL_USER;
   const reply_to = user.email;
   const sent_from = process.env.EMAIL_USER;
 
   try {
    await sendEmail(subject, message, send_to, sent_from,reply_to);
    res.status(200).json({ sucess: true, message: "Reset Email Sent" });
    
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, Please try again");
  }
})



export default contactUs