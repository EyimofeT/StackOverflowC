import userModel from '../models/users.js'
// import { userModel } from '../models/users.js'
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken'


export const createUser = async (req, res) => {
    const user = new userModel({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        role: req.body.role


    })
    try {
        const newUser = await (user.save())
        res.status(200).json({ "message": "User Created Successfully" })
    }
    catch (err) {
        res.status(400).json({ "message": err.message })
    }


}

export const getUsers = async (req, res) => {

    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json({ message: "No Token Found!" });
    }



    try {
        try {
            const data = jwt.verify(token, process.env.SECRET_KEY);
            let asking_user = await userModel.findById(data.id)
            if (asking_user.role == "1") {
                const users = await userModel.find()
                let user = []
                let i = 0
                while (i < users.length) {
                    let published_role
                    if (users[i].role == "1") {
                        published_role = "admin"
                    }
                    else {
                        published_role = "user"
                    }
                    user.push({
                        "firstname": users[i].firstname,
                        "lastname": users[i].lastname,
                        "email": users[i].email,
                        "username": users[i].username,
                        "user_id": users[i]._id,
                        "role": published_role

                    })
                    i++
                }
                res.status(200).json(user)
            }
            else {
                res.status(403).json({ message: "Unauthorized!" })
            }

        }
        catch {
            return res.status(401).json({ message: "Invalid Token Found!" });
        }

    }
    catch (err) {
        res.status(500).json({ "message": err.message })
    }

}

export const getUser = async (req, res) => {
    const token = req.cookies.access_token;
    let user
    if (!token) {
        return res.status(401).json({ message: "No Token Found!" });
    }

    try {
        try {
            const data = jwt.verify(token, process.env.SECRET_KEY);

            user = await userModel.findOne({ "_id": data.id })

            if (user == null) {
                res.status(404).json({ "message": "Cannot Find User" })
            }
            else {

                res.status(200).json({ "firstname": user.firstname, "lastname": user.lastname, "email": user.email, "username": user.username })
            }

        }
        catch (err) {
            return res.status(401).json({ message: "Unauthorized!" });
        }

    }
    catch (err) {
        res.status(500).json({ "message": err.message })
    }

}

export const deleteUser = async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json({ message: "No Token Found!" });
    }

    let user
    if (req.body.user_id) {
        try {
            const data = jwt.verify(token, process.env.SECRET_KEY);

            user = await userModel.findById(data.id)

            if (user.role === "1") {
                // console.log("admin user")
                let affected_user = await userModel.findById(req.body.user_id)
                if (affected_user == null) {
                    res.status(404).json({ "message": "Cannot Find User" })
                }
                else {
                    await affected_user.remove()
                    res.status(200).json({ "message": "Success" })
                }

            }
            else {
                // console.log("regular user")
                res.status(401).json({ "message": "Unauthorized!" })
            }
       
        }
        catch (err) {
            return res.status(401).json({ message: "Unauthorized!" });
        }
    }
    else {
        res.status(401).json({ "message": "User id missing!" })
    }


}

export const updateUser = async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json({ message: "No Token Found!" });
    }

    if (token) {
        const tokendata = jwt.verify(token, process.env.SECRET_KEY);
        const filter = { _id: tokendata.id }
        const updatedata = {}
        const updateDocument = {
            $set: updatedata
        }
        try {
            
            if (req.body.firstname != null || req.body.firstname !== undefined) {
                updatedata["firstname"] = req.body.firstname
            }
            if (req.body.lastname != null || req.body.lastname !== undefined) {
                updatedata["lastname"] = req.body.lastname
            }
            if (req.body.username != null || req.body.username !== undefined) {
                updatedata["username"] = req.body.username
            }
            if (req.body.email != null || req.body.email !== undefined) {
                updatedata["email"] = req.body.email
            }
            if (req.body.password != null || req.body.password !== undefined) {
                updatedata["password"] = bcrypt.hashSync(req.body.password, 8)
            }
            try {
                const result = await userModel.updateOne(filter, updateDocument)
                res.status(200).json({ "message": "Success" })
            }
            catch (err) {
                res.status(400).json({ "message ": err.message })
            }
        }
        catch (err) {
            res.status(401).json({ "message ": err.message })
        }
    }
    else {
        res.status(401).json({ "message ": "User id missing!" })
    }


}






