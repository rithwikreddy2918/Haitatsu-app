import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },

  items: [
    {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      description: { type: String },
      price: { type: Number, required: true },
      image: { type: String },
      category: { type: String },
      quantity: { type: Number, required: true },
    },
  ],

  amount: { type: Number, required: true },
  address: { type: Object, required: true },

  // ✅ Razorpay payment info (keep this object intact)
  payment: {
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
  },

  // ✅ Status of payment
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },

  // ✅ Order progress
  status: {
    type: String,
    enum: ["Food Processing", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Food Processing",
  },

  date: { type: Date, default: Date.now },
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
