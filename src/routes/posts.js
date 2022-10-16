import express from 'express';

import {  createPost, getUserPost, getUsersPost , deletePost, updatePost} from '../controllers/posts.js';

const router = express.Router();

router.get('/', getUsersPost);
router.post('/', createPost);
router.propfind('/', getUserPost)
router.delete('/', deletePost)
router.patch('/',updatePost)

router.get('/',(req,res)=> {
    res.send("Post Route")
})
export default router;