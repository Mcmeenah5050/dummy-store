import Order from "../models/order.js";
import createHttpError from "http-errors";
import User from "../models/user.js";

export const createOrder = async (req, res, next) => {
  const { id: userId } = req.user;
  const { orderItems, qty, paymentMethod, fullname, address, phone, total } =
    req.body;
  try {
    if (
      !orderItems ||
      !qty ||
      !paymentMethod ||
      !fullname ||
      !address ||
      !phone ||
      !total
    ) {
      return next(createHttpError(400, "Order details are missing"));
    }
    const order = await Order.create({
      userId: userId,
      orderItems,
      qty,
      paymentMethod,
      fullname,
      address,
      phone,
      total,
    });
    await order.save();
    res.status(201).json({ order, msg: "Order successfully created" });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ _id: -1 });
    if (!orders) {
      return next(createHttpError(404, "Orders not found"));
    }
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    const orders = await Order.find({ userId }).sort({ _id: -1 });
    if (!orders) {
      return next(createHttpError(404, "Orders not found"));
    }
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const getASingleOrder = async (req, res, next) => {
  const { orderId } = req.params;
  try {
    if (!orderId) {
      return next(createHttpError(400, "Order Id not provided"));
    }
    const order = await Order.findById(orderId);
    if (!orderId) {
      return next(createHttpError(404, "Order not found"));
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const deleteAnOrder = async (req, res, next) => {
  const { orderId } = req.params;
  try {
    if (!orderId) {
      return next(createHttpError(400, "Order Id not provided"));
    }
    await Order.findByIdAndDelete(orderId);
    res.status(200).json("Order deleted");
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  const { orderId } = req.params;
  const { orderStatus, isPaid, isDelivered, deliveryStatus } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return next(createHttpError(404, "Order not found"));
    }
    const updatedFields = {
      orderStatus,
      deliveryStatus: isDelivered ? "delivered" : deliveryStatus, 
      isPaid,
      paidAt: isPaid ? Date.now() : undefined,
      isDelivered,
      deliveredAt: isDelivered ? Date.now() : undefined,
    };
    const updatedOrder = await Order.findByIdAndUpdate(orderId, updatedFields, {
      new: true,
    });
    res.status(200).json({ updatedOrder, msg: "Order info updated" });
  } catch (error) {
    next(error);
  }
};
