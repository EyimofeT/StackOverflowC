
import bcrypt from 'bcryptjs';
// import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import userModel from '../models/users.js'
dotenv.config()


export const login = async (req, res) => {
    let user
    if (req.body.email) {
        try {
            user = await userModel.findOne({ "email": req.body.email.toLowerCase() })
            if (user == null) {
                res.status(404).json({ "message": "Cannot Find User" })
            }
            else {
                // res.status(201).json(user.password)
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    var token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '30m' });
                    res.cookie("access_token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                    }).status(201).json({ message: "Logged in successfully 😊 👌" });
                }
                else {
                    res.status(400).json({ "message": "Invalid Login Credentials" })
                }
            }
        }
        catch (err) {
            res.status(500).json({ "message": err.message })
        }
    }
    else {
        res.status(400).json({ "message": "Missing Login Credentials!" })
    }


}

export const logout = (req, res) => {
    return res
    .clearCookie("access_token")
    .clearCookie("baccess_token")
    .status(200)
    .json({ message: "Successfully logged out 😏 🍀" });
}