import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

const loginUser= async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user =await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"user not found"})
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false,message:"invalid password"})
        }
        const token=createToken(user._id);
        res.json({success:true,token}); 
    }catch(error){
        console.log(error);
        res.json({success:false,message:"something went wrong"})
    }

}
const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}
const registerUser=async(req,res)=>{
    const {name,email,password}=req.body;
    try{
        const exits=await userModel.findOne({email});
        if(exits){
            return res.json({success:false,message:"user already exits"})
        } if(!validator.isEmail(email)){
            return res.json({success:false,message:"invalid email"})
        } if(password.length<8){
            return res.json({success:false,message:"password must be 8 character"})
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new userModel({
            name:name,
            email:email,
            password:hashedPassword
        });
         const user = await newUser.save();
        const token=createToken(user._id);
        res.json({success:true,token});
    }catch(error){
        console.log(error);
        res.json({success:false,message:"something went wrong"})
    }
}
export {loginUser,registerUser}