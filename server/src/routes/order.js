import { Router } from "express";
import {
  createOrder,
  deleteAnOrder,
  getAllOrders,
  getASingleOrder,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/order.js";
import { verifyAuth, Roles } from "../middlewares/verifyAuth.js";

const router = Router();

router.post("/create", verifyAuth(Roles.All), createOrder);

router.get("/all", verifyAuth(Roles.Admin), getAllOrders);
router.get("/user-orders", verifyAuth(Roles.All), getUserOrders);
router.get("/get/:orderId", verifyAuth(Roles.All), getASingleOrder);
router.delete("/delete/:orderId", verifyAuth(Roles.Admin), deleteAnOrder);

router.patch("/update/:orderId", verifyAuth(Roles.Admin), updateOrderStatus);

export default router;
