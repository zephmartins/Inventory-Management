import express from "express";
import registerUser from "../controllers/usercontroller.js";
import loginuser from "../controllers/loginuser.js"
import logout from "../controllers/logout.js"
import getuser from "../controllers/getuser.js"
import protect from "../middleware/authmiddleware.js";
import loginStatus from "../controllers/loginstatus.js";
import {updateUser, changePassword,forgetPassword, resetPassword} from "../controllers/updateuser.js";
const router = express.Router();


router.post("/register", registerUser)
router.post("/login", loginuser)
router.get("/logout", logout)
router.get("/getuser",protect, getuser)
router.get("/loggedin", loginStatus)
router.patch("/updateuser", protect,updateUser)
router.patch("/changepassword", protect,changePassword)
router.post("/forgetpassword",forgetPassword);
router.get("/resetpassword/:resetToken", (req,res) =>{
    res.send("Hello world")
})
router.put("/resetpassword/:resetToken",resetPassword);



export default router
