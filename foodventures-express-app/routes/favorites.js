import express from "express";
import { Favorite } from "../models/favorite";
import { Op } from "sequelize";

const router = express.Router();

router.get("/get_favorites", async (req, res) =>{
    try{
        const user = req.session.user;
        const favorites = await Favorite.findOne({ where: { userId: user.id } });
        res.json(favorites);
    }
    catch(error){
        res.status(500).json({error: "Server Error"});
    }
})

/*
router.post("/add_favorites", async (req, res) =>{
    try{

    }
    catch(error){
        res.status(500).json({error: "Server Error"});
    }
})
*/
export default router;
