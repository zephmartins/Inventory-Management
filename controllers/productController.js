import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import { fileSizeFormatter } from "../utils/fileupload.js";
import { v2 as cloudinary } from "cloudinary";

const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;

  // Validation
  if (!name || !category || !quantity || !price || !description) {
    res.status(400);
    throw new Error("Please fill in all field");
  }

  // manage image upload
  let fileData = {};
  if (req.file) {
    // save image to cloudinary
    let uploadedFIle;
    try {
      uploadedFIle = await cloudinary.uploader.upload(req.file.path, {
        folder: "Zimech Inventory",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFIle.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  // create product
  const product = await Product.create({
    user: req.user.id, //This points to the user thats currently logged in
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image: fileData,
  });

  res.status(201).json(product);
});

const getAllProduct = asyncHandler(async (req, res) => {
  const product = await Product.find({ user: req.user.id }).sort("-createdAt");

  res.status(200).json(product);
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.user.toString() !== req.user.id) {
    res.status(404);
    throw new Error("User Not Authorized");
  }

  res.status(200).json(product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.user.toString() !== req.user.id) {
    res.status(404);
    throw new Error("User Not Authorized");
  }

  await product.deleteOne();
  res.status(200).json({ message: "Deleted Successfully" });
});

//Delete All Product
const deleteAllProduct = asyncHandler(async (req, res) => {
  const product = await Product.find({ user: req.user.id });
  if (product.length > 0) {
    await Product.deleteMany({ user: req.user.id });
    res.status(200).json({ message: "Deleted Successfully" });
  } else {
    res.status(404).json({ message: "No products found for this user" });
  }

  res.status(200).json({ message: "Deleted Successfully" });
});

// Update Product

const updateProduct = asyncHandler(async (req, res) => {
    const { name, category, quantity, price, description } = req.body;
    const { id } = req.params;
  
    const product = await Product.findById(id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
  
    if (product.user.toString() !== req.user.id) {
      res.status(403);
      throw new Error("User Not Authorized");
    }
  
    // Manage image upload
    let fileData = {};
    if (req.file) {
      try {
        const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
          folder: "Zimech Inventory",
          resource_type: "image",
        });
  
        fileData = {
          fileName: req.file.originalname,
          filePath: uploadedFile.secure_url,
          fileType: req.file.mimetype,
          fileSize: fileSizeFormatter(req.file.size, 2),
        };
      } catch (error) {
        res.status(500);
        throw new Error("Image could not be uploaded");
      }
    }
  
    // Only update fields that were provided in the request
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: id },
      {
        name: name || product.name,
        category: category || product.category,
        quantity: quantity || product.quantity,
        price: price || product.price,
        description: description || product.description,
        image: Object.keys(fileData).length === 0 ? product.image : fileData , // Ensure image is only updated if provided
      },
      { new: true, runValidators: true }
    );
  
  
  
  
  res.status(200).json(updatedProduct)


 
});




export {
  createProduct,
  getAllProduct,
  getProduct,
  deleteProduct,
  deleteAllProduct,
  updateProduct,
};
