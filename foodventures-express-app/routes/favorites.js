import express from "express";
import { Favorite } from "../models/favorites.js";
import { Op } from "sequelize";

const router = express.Router();

router.get("/get_favorites", async (req, res) => {
    try {
      const user = req.session.user;
      console.log(req.session.user)
      if (!user) {
        throw new Error('User not authenticated'); 
      }
  
      console.log(user);
      const favorites = await Favorite.findAll({ where: { id: user.id } });
      res.json(favorites);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  });

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
