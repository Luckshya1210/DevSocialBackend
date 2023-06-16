import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/user.js'

export const signin=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const ex=await User.findOne({email})
        if(!ex){
            return res.status(404).json({message:"User doesnt exist "})
        }
        const ispasscorrect=await bcrypt.compare(password,ex.password)
        if(!ispasscorrect){
            return res.status(400).json({message:"Invalid credentials"})
        }
        const token=jwt.sign({email:ex.email,id:ex._id},'test',{expiresIn:"1h"})
        res.status(200).json({newUser:ex,token})
    
    }
    catch(err){
        res.status(500).json({message:"Something went wrong"})
    }

}
export const signup=async(req,res)=>{
    //check for an existing user
    //check for password match
    //create a user and sign it with a token and return it
    const {email,password,confirmPassword,firstName,lastName}=req.body;
    try{
        const ex=await User.findOne({email});
        if(ex){ 
            return res.status(401).json({message:"User already exists!"});

        }
        if(password!=confirmPassword){
            return res.status(402).json({message:"Passwords did not match!"})
        }       
        const hashedp=await bcrypt.hash(password,12)
        const newUser=await User.create({email,password:hashedp,name:`${firstName} ${lastName}`});
        const token= jwt.sign({email:newUser.email,id:newUser._id},'test',{ expiresIn: "1h" });
        res.status(200).json({newUser,token})
    }
    catch(err){
        res.status(500).json({message:"Something went wrong"})
    }

}
