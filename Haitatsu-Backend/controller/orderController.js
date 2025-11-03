import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";
import 'dotenv/config'
import crypto from "crypto";
const razorpayInstance=new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET,
});

const placeOrder=async(req,res)=>{
    const frontendUrl="http://localhost:5174"
try{
     console.log("Frontend sent amount (USD):", req.body.amount);
 const newOrder=new orderModel({
    userId:req.body.userId,
    items:req.body.items,
    amount:req.body.amount,
    address:req.body.address,
 })
 await newOrder.save();
 await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});
 const conversionRate = 83; // 1 USD = ₹83 (approx)
    const totalAmountInINR = req.body.amount * conversionRate; // You already send total (subtotal + 2)
const options = {
  amount: Math.round(totalAmountInINR * 100),// Convert to paise
  currency: "INR",
  receipt: `order_rcptid_${newOrder._id}`,
  notes: {
    orderId: newOrder._id.toString(),
    userId: req.body.userId,
  },
};

const order = await razorpayInstance.orders.create(options);
  await orderModel.findByIdAndUpdate(newOrder._id, {
    $set: { "payment.razorpay_order_id": order.id }
  });
res.json({
  success: true,
  orderId: order.id,
  dbOrderId: newOrder._id,
  amount: order.amount,
  currency: order.currency,
  key: process.env.RAZORPAY_KEY_ID,
});
}catch(error){
    console.log(error);
    res.json({success:false,message:"Error in placing order"});

}
}

const verifyOrder = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature,orderId,dbOrderId } = req.body;

    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment params" });
    }
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;
     const query = dbOrderId ? { _id: dbOrderId } : { "payment.razorpay_order_id": razorpay_order_id };
    if (isAuthentic) {
      await orderModel.findOneAndUpdate(query,{
          $set: {
            "payment.razorpay_order_id": razorpay_order_id ,
            "payment.razorpay_payment_id": razorpay_payment_id,
            "payment.razorpay_signature": razorpay_signature,
            paymentStatus: "Paid",       
            status: "Processing",  
          }
        }
      );
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      await orderModel.findOneAndUpdate(
        { "payment.razorpay_order_id": razorpay_order_id },
        { $set: { status: "Failed" } }
      );
      res.json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error in payment verification" });
  }
};
const userOrders=async(req,res)=>{
try{
   const orders=await orderModel.find({userId:req.body.userId});
   res.json({success:true,data:orders});
}catch(error){
  console.log(error);
 res.json({success:false,message:"Error in fetching user orders"});
}
}

const listOrders=async(req,res)=>{
  try{
      const orders=await orderModel.find({});
      res.json({success:true,data:orders});
  }catch(error){
    console.log(error);
   res.json({success:false,message:"Error in fetching orders"});
  }
}

const updateStatus=async(req,res)=>{
 try{
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
    res.json({success:true,message:"Status updated"});
 }catch(error){
  console.log(error);
  res.json({success:false,message:"Error in updating status"});
 }
}

export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus};