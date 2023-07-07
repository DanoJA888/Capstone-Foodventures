import express from 'express';
import { User } from '../models/user.js';


const router = express.Router();

router.get('/user', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.post('/user', async (req, res) =>{
    try {
        const createUser = await User.create(req.body)
        res.status(201).json(createUser)
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
})
export default router;
