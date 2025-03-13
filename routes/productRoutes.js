import express from "express";
import protect from "../middleware/authmiddleware.js";
import {createProduct, deleteAllProduct, deleteProduct, getAllProduct, getProduct, updateProduct} from "../controllers/productController.js";
import{upload}  from "../utils/fileupload.js";


const router =  express.Router();


router.post("/",protect, upload,createProduct)
router.get("/",protect, getAllProduct)
router.get("/:id",protect, getProduct)
router.patch("/:id",protect,upload, updateProduct)
router.delete("/:id",protect, deleteProduct)
router.delete("/",protect, deleteAllProduct)





export default router