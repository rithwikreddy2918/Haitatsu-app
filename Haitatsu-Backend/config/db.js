import mongoose from "mongoose";

export const connectDB=async()=>{
    await mongoose.connect('mongodb+srv://haitatsu:haitatsu@cluster0.xrcnag4.mongodb.net/Haitatsu-app').then(()=>console.log("DB connected"));
}