// db
import mongoose from 'mongoose';

export const postModel = new mongoose.Schema({
    user_id:{
        type: String,
        required : true
    },
    title:{
        type: String,
        required : true,
    }, 
    description:{
        type: String,
        required : true,
       
    },
    createdAt: {
        type : Date,
        default : Date.now
    }
})

export default mongoose.model('postModel',postModel)
// module.exports = mongoose.model('userModel', userModel)




