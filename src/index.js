import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()
import {databaseConnection} from '../src/configs/db.js'

import usersRoutes from './routes/users.js'
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import cookieParser from 'cookie-parser';

const app = express();

const PORT = 5001;

databaseConnection()

app.use(express.json())
app.use(cookieParser())

app.use('/users', usersRoutes);
app.use('/auth', authRoutes)
app.use('/post', postRoutes)

app.get('/',(req, res)=>{
    res.send('List of Routes');
}) 

app.listen(PORT, () => console.log(`Server running on port : http://localhost:${PORT}`)) 