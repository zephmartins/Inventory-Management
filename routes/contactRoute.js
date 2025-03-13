import express from "express"
import protect from "../middleware/authmiddleware.js"
import contactUs from "../controllers/contactController.js"

const router = express.Router()


router.post("/", protect,contactUs)



export default router