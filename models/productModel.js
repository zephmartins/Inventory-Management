import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    name:{
        type: String,
        required: [true, "Please add a name"],
        trim: true

    },

    sku:{
        type: String,
        required: true,
        default: "SKU",
        trim: true
    },
    category:{
        type: String,
        required: [true,"Please add a category"],
        trim: true
    },
    quantity:{
        type: String,
        required: [true,"Please add a quantity"],
        trim: true

    },
    price:{
        type: String,
        required: [true,"Please add a price"],
        trim: true

    },
    description:{
        type: String,
        required: [true,"Please add a description"],
        trim: true

    },
    image:{
        type: Object,
        default: {}

    }


},{
    timestamps:true, // This adds the date it was created and the date it is updated
})

const Product = mongoose.model("Product", productSchema)

export default Product