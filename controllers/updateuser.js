import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import Token from "../models/tokenmodel.js";
import sendEmail from "../utils/sendemail.js";

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { name, email, photo, phone, bio } = user;
    email;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.photo = req.body.photo || photo;
    user.bio = req.body.bio || bio;

    const updated = await user.save();
    res.status(200).json({
      name: updated.name,
      email: updated.email,
      photo: updated.photo,
      phone: updated.phone,
      bio: updated.bio,
    });
  } else {
    res.status(404).json({
      message: "User not found",
    });
  }
});

const changePassword = asyncHandler(async  (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(400).json({ message: "User not found, please sign up" });
  }

  const { oldPassword, password } = req.body;
  // Validate
  if (!oldPassword && !password) {
    res.status(400).json({ message: "Please add old and new password" });
  }


  //check if old password matches password in the db
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  // save new password
  if (user && passwordIsCorrect) {
    user.password = password;
    await user.save();
    res.status(200).send("Password changed successful");
  } else {
    res.status(404).json({ message: "Old password is incorrect" });
  }
});

const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }

  // Delete token if exists in DB
  let token = await Token.findOne({userId: user._id})

  if(token){
    await token.deleteOne()
  }

  // Create Reset Token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(resetToken);
  
  // hash token before saving to DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //save token to db
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), // Thirty minutes
  }).save();

  // Construct Reset Url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // Reset Email
  const message = `
        <h2>Hello ${user.name}</h2>
        <p>Please use the url below to reset your password</p>
        <p>This reset link is valid for 30minutes</p>

        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

        <p>Regards...</p>
        <p>Zimech</p>

    `;
  const subject = "Password Reset Request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json({ sucess: true, message: "Reset Email Sent" });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, Please try again");
  }
});

//Reset Password
const resetPassword = asyncHandler(async (req,res) => {
    const {password} = req.body;
    const {resetToken} = req.params;

    // hash token then compare to the one in the database
  const hashedToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");

  // Find token in DB
  const userToken = await Token.findOne({
    token:hashedToken,
    expiresAt: {$gt: Date.now()}

  })

  if(!userToken){
    res.status(404);
    throw new Error("Invalin or Expired Token");
  }

  //Find User
  const user =  await User.findOne({_id: userToken.userId})
  user.password = password
  await user.save()
  res.status(200).json({message: "Password reset successful, Please Login"})

})

export { updateUser, changePassword, forgetPassword, resetPassword };
