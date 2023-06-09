import express from "express";
import { getPosts,getPost,createPost,updatePost,deletePost,likePost,getbysearch,commentPost } from "../controllers/posts.js";
import auth from "../middleware/auth.js";
const router=express.Router();

router.get('/',getPosts)
router.get('/search',getbysearch)
router.get('/:id',getPost)
router.post('/',auth,createPost)
router.patch('/:id',auth,updatePost);
router.delete('/:id',auth,deletePost)
router.patch('/:id/likePost',auth,likePost)
router.post('/:id/commentPost',auth,commentPost)
export default router