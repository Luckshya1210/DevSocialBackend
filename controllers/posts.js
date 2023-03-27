import mongoose from "mongoose";
import PostMessage from "../models/postsMessage.js"
export const getPosts=async(req,res)=>{
    const {page}=req.query
    try{
        const LIMIT=9;
        const stind=(Number(page)-1)*LIMIT  //get st index
        const totl=await PostMessage.countDocuments({});
        const posts=await PostMessage.find().sort({_id:-1}).limit(LIMIT).skip(stind);
        // console.log(posts)
        res.status(200).json({data:posts,currentPage:Number(page),numberOfPages:Math.ceil(totl/LIMIT)})
    }
    catch(error){
        res.status(404).json({message:error.message})
    }
}
export const getPost =async(req,res)=>{
    const {id}=req.params   
    try{
        const post=await PostMessage.findById(id);
        // console.log(posts)
        res.status(200).json(post)
    }
    catch(error){
        res.status(404).json({message:error.message})
    }
}
export const createPost=async(req,res)=>{
    const post=req.body;
    const newpost=new PostMessage({...post,creator:req.userId,createdAt:new Date().toISOString()})
    try{
        await newpost.save()
        res.status(200).json(newpost)
    }   
    catch(error){
        res.status(409).json({message:error.message})
    }
}
export const updatePost=async(req,res)=>{
    const {id:_id}=req.params;
    const post=req.body
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('No post')
    }

    const upd=await PostMessage.findByIdAndUpdate(_id,{...post,_id},{new:true})

    res.json(upd)


}
export const getbysearch=async(req,res)=>{
    const {searchQuery,tags}=req.query;
    try{    
        const title=new RegExp(searchQuery,"i");
        const posts=await PostMessage.find({$or:[{title},{tags:{$in:tags.split(',')}}]})
        res.json({data:posts})
    }catch(err){
        console.log(err)
    }
}
export const deletePost=async(req,res)=>{
    const {id}=req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send('No post')
    }

    await PostMessage.findByIdAndRemove(id);
    res.json({message:'Post deleted succesfully'})
}
export const likePost=async(req,res)=>{
    const {id}=req.params;
    if(!req.userId){
        return res.json({message:"Unauthenticated!"})
    }
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send('No post')
    }
    const post=await PostMessage.findById(id);
    const index=post.likes.findIndex((id)=>id===String(req.userId))
    if(index==-1){
        //like the post if user has not liked previously
        post.likes.push(req.userId)
    }else{
        //dislike
        post.likes=post.likes.filter((id)=>id!=req.userId)
    }
    const updatedPost=await PostMessage.findByIdAndUpdate(id,post,{new:true})
    res.status(200).json(updatedPost)
}
export const commentPost=async(req,res)=>{
    const {id}=req.params
    const {value}=req.body
    const post=await PostMessage.findById(id);
    post.comments.push(value);
    const updated= await  PostMessage.findByIdAndUpdate(id,post,{new:true});
    res.json(updated)
}