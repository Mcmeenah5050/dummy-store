import { uploadMultiImages } from "../config/cloudinary.js";
import Product from "../models/product.js";
import createHttpError from "http-errors";

export const createProduct = async (req, res, next) => {
  const { title, description, images, price, category, brand } = req.body;
  try {
    if (!title || !description || !images || !price || !category) {
      return next(createHttpError(400, "Required Product fields are missing"));
    }
    let productImages = [];
    if (images) {
      try {
        const uploadedImages = await uploadMultiImages(images);
        productImages.push(...uploadedImages);
      } catch (error) {
        console.error(error);
        return next(createHttpError(500, "Failed to upload images"));
      }
    }

    const product = await Product.create({
      title,
      description,
      images: productImages,
      price: parseFloat(price),
      category,
      brand,
    });
    await product.save();
    res.status(201).json({ product, message: "Product created" });
  } catch (error) {
    next(error);
  }
};

export const getProductsByCategory = async (req, res, next) => {
  const { categoryName } = req.params;
  try {
    const products = await Product.find({ category: categoryName });
    if (!products) {
      return next(
        createHttpError(404, `Products not found matching ${categoryName}`)
      );
    }
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getASingleProduct = async (req, res, next) => {
  const { title } = req.params;
  try {
    if (!title) {
      return next(createHttpError(400, "Product title not defined"));
    }

    //get all products
    const products = await Product.find();

    //get a single product by its title
    const product = await Product.findOne({ title: title });
    if (!product) {
      return next(createHttpError(404, "Product not found"));
    }

    const getRecommended = products.filter(
      (item) => item.category !== product.category
    );
    res.status(200).json({ product, getRecommended });
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (req, res, next) => {
  const query = req.query.q;
  try {
    const searchQuery = query.trim();
    const searchResults = await Product.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { brand: { $regex: searchQuery, $options: "i" } },
      ],
    });
    if (!searchResults) {
      return next(createHttpError(404, "Search did not return a match"));
    }
    res.status(200).json(searchResults);
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ _id: -1 });
    if (!products) {
      return next(createHttpError(404, "Products not found"));
    }
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  const { id: productId } = req.params;
  const { title, description, images, price, category, inStock, brand } =
    req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      createHttpError(404, "Product not found");
    }
    let productImages = [];
    if (images) {
      try {
        const uploadedImages = await uploadMultiImages(images);
        productImages.push(...uploadedImages);
      } catch (error) {
        console.error(error);
        return next(createHttpError(500, "Failed to upload images"));
      }
    }

    //form fields to be updated
    const updatedFields = {
      title,
      description,
      price: parseFloat(price),
      category,
      images: productImages,
      inStock,
      brand,
    };
    Object.keys(updatedFields).forEach((key) => {
      if (
        updatedFields[key] === "" ||
        updatedFields[key] === undefined ||
        (Array.isArray(updatedFields[key]) && updatedFields[key].length === 0)
      ) {
        delete updatedFields[key];
      }
    });

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedFields,
      {
        new: true,
      }
    );

    // product.title = title || product.title;
    // product.description = description || product.description;
    // product.price = parseFloat (price) || product.price;
    // product.category = category || product.category;
    // product.images = productImages || product.images;
    // product.inStock = inStock;
    // product.brand = brand || product.brand;
    res
      .status(200)
      .json({ updatedProduct, msg: "Product updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  const { id: productId } = req.params;
  try {
    if (!productId) {
      return next(createHttpError(400, "Product id is missing"));
    }
    const product = await Product.findById(productId);
    if (!product) {
      return next(createHttpError(404, "Product not foiund"));
    }
    await product.deleteOne();
    res.status(200).json({ msg: "Product deleted" });
  } catch (error) {
    next(error);
  }
};
