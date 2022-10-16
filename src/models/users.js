// db
import mongoose from 'mongoose';

export const userModel = new mongoose.Schema({
    firstname:{
        type: String
    },
    lastname:{
        type: String
    }, 
    username:{
        type: String,
        required : true,
        unique: true
    },
    email:{
        type: String,
        required : true,
        unique: true
    },
    password:{
        type: String,
        required : true
    },
    role:{
        type: String,
       default: "0"
    },
    createdAt: {
        type : Date,
        default : Date.now
    }
})

export default mongoose.model('userModel',userModel)
// module.exports = mongoose.model('userModel', userModel)




