import { Schema, model } from "mongoose";

const productSchema = new Schema ({
title: {
    type: String,
    required: true,
},
description: {
    type: String,
    required: true,
},
category: {
    type: String,
    enum: ["Beauty", "Tech", "Home", "Fashion"],
    required: true,
},
images: {
   type: [String],
   required: true,
},
price: {
    type: Number,
    required: true,
},
brand: {
    type: String,
},
inStock: {
    type: Boolean,
    default: true,
},

},
 {
timestamps: true,
});

const Product = model("Product", productSchema);

export default Product;
