import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getASingleProduct,
  getProductsByCategory,
  searchProducts,
  updateProduct,
} from "../controllers/product.js";
import { verifyAuth, Roles } from "../middlewares/verifyAuth.js";

const router = Router();

router.post("/create", verifyAuth(Roles.Admin), createProduct);

router.get("/:categoryName", getProductsByCategory);

router.get("/single/:title", getASingleProduct);
router.get("/get/search", searchProducts);
router.get("/", getAllProducts);
router.patch("/update/:id", verifyAuth(Roles.Admin), updateProduct);
router.delete("/delete/:id", verifyAuth(Roles.Admin), deleteProduct);

export default router;
