import express from 'express';

import {  createUser, getUser, getUsers , deleteUser, updateUser} from '../controllers/users.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.propfind('/', getUser)
router.delete('/', deleteUser)
router.patch('/',updateUser)

router.get('/',(req,res)=> {
    res.send("User Route")
})
export default router;