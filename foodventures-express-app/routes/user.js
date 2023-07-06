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
export default router;
