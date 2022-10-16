import postModel from '../models/posts.js'
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import userModel from '../models/users.js'


export const createPost = async (req, res) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ message: "No Token Found!" });
    }

    try {
        const data = jwt.verify(token, process.env.SECRET_KEY);
        const post = new postModel({
            user_id: data.id.toString(),
            title: req.body.title,
            description: req.body.description,
        })
        const newPost = await (post.save())
        res.status(200).json({ "message": "Post Created Successfully"})
    }
    catch (err) {
        res.status(401).json({ "message": err.message })
    }
}

export const getUsersPost = async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json({ message: "No Token Found!" });
    }

    try {
        const data = jwt.verify(token, process.env.SECRET_KEY);
        const posts = await postModel.find()
        let post = []
        let i = 0
        while (i < posts.length) {

            post.push({
                "id": posts[i]._id,
                "user_id": posts[i].user_id,
                "title": posts[i].title,
                "description": posts[i].description,
                "created_at": posts[i].createdAt,

            })
            i++
        }
        res.status(200).json(post)
    }
    catch (err) {
        res.status(401).json({ "message": "Unauthorized!"})
    }
}

export const getUserPost = async (req, res) => {
    const token = req.cookies.access_token;
    let posts
    if (!token) {
        return res.status(401).json({ message: "No Token Found!" });
    }

    try {
        const data = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(data.id)
        posts = await postModel.find({ user_id: data.id })


        if (posts == null) {
            res.status(404).json({ "message": "Cannot Find Posts" })
        }
        else {
            res.status(200).json( posts )
            // res.status(201).json({ "id":posts._id,"title": posts.title, "description": posts.description, "createdAt": posts.createdAt })
        }
    }
    catch (err) {
        res.status(401).json({ "message": "Unauthorized!" })
    }

}

export const deletePost = async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json({ message: "No Token Found!" });
    }
    let user, post
    if (req.body.post_id) {
        try {
            const data = jwt.verify(token, process.env.SECRET_KEY);
            user = await userModel.findById(data.id)
            post = await postModel.findOne({ "_id": req.body.post_id })

            if (user.role === "1" || post.user_id == data.id) {
                try {
                    await post.remove()
                    res.status(200).json({ "message": "Success" })

                }
                catch (err) {
                    res.status(500).json({ "message": "Unable to Delete!", "error": err })
                }
                // if (user.role === "1" || post.user_id == data.id) {
                // console.log("admin user")
                // let affected_user = await userModel.findById(req.body.user_id)
                // if (affected_user == null) {
                //     res.status(404).json({ "message": "Cannot Find User" })
                // }
                // else {
                //     await affected_user.remove()
                //     res.status(201).json({ "message": "Success" })
                // }

            }
            else {
                // console.log("regular user")
                res.status(400).json({ "message": "Unauthorized!" })
            }
        }
        catch (err) {
            res.status(401).json({ "message": "Unauthenticated!" })
        }
    }
    else {
        res.status(401).json({ "message": "Post id missing!" })
    }


}


export const updatePost = async (req, res) => {
    const token = req.cookies.access_token;
    let user, post
    if (!token) {
        return res.status(401).json({ message: "No Token Found!" });
    }
    try {
        const data = jwt.verify(token, process.env.SECRET_KEY);
        if (req.body.post_id) {

            const filter = { _id: req.body.post_id }
            const updatedata = {}
            const updateDocument = {
                $set: updatedata
            }



            try {
                user = await userModel.findById(data.id)
                post = await postModel.findOne({ "_id": req.body.post_id })

                if (user.role === "1" || post.user_id == data.id) {
                    try {
                        //res.status(201).json({ "message": "Succesms" })
                        if (req.body.title != null || req.body.title !== undefined) {
                            updatedata["title"] = req.body.title
                        }
                        if (req.body.description != null || req.body.description !== undefined) {
                            updatedata["description"] = req.body.description
                        }
                        
                        if(post){
                        try {
                            const result = await postModel.updateOne(filter, updateDocument)
                            res.status(200).json({ "message": "Success" })
                        }
                        catch (err) {
                            res.status(500).json({ "message ": err.message })
                        }
                    }
                    else{
                        res.status(404).json({"Message":"Post Not Found"})
                    }

                    }
                    catch (err) {
                        res.status(401).json({ "message": "Unable to Update!", "error": err })
                    }
                }
                else {
                    // console.log("regular user")
                    res.status(401).json({ "message": "Unauthorized!" })
                }
            }
            catch (err) {
                res.status(401).json(err)
            }
        }
        else {
            res.status(404).json({ "message ": "Missing Post Id!" })
        }
    }
    catch (err) {
        res.status(401).json({ "message ": "Unauthorized!" })
    }
}
