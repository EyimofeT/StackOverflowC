import mongoose from 'mongoose';



export function databaseConnection(){
mongoose.connect(process.env.DB_URL,{useNewUrlParser : true})

const db= mongoose.connection
db.on('error',(error) => console.log(error))
db.once('open', () => console.log("Connected to Database"))
}