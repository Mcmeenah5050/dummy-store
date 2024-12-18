import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cash"],
    },
    qty: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
      default: 0.0,
    },
    orderItems: [
      {
        title: {
          type: String,
          required: true,
        },
        qty: {
          type: String,
          required: true,
        },
        price: { type: Number, required: true },
        images: {type: [String], required: true},
      },
    ],
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    orderStatus: {
      type: String,
      enum: ["open", "processing", "completed"],
      default: "open",
    },
    deliveryStatus: {
      type: String,
      enum: ["preparing", "on the way", "delivered"],
      default: "preparing",
    },
  },
  {
    timestamps: true,
  }
);

const Order = model("Order", orderSchema);
export default Order;
