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
      const favorites = await Favorite.findAll({ where: { userId: user.id } });
      res.json(favorites);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  });

  router.post("/check_favorite", async (req, res) => {
    try {
        const {recipeId} = req.body;
      const user = req.session.user;
      if (!user) {
        throw new Error('User not authenticated'); 
      }
      const favorites = await Favorite.findOne({ where: { userId: user.id, recipeId: recipeId} });
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  });

router.post("/add_favorites", async (req, res) =>{
    
    try{
        const user = req.session.user;
        const {recipeId, recipeName} = req.body;
        if (!user) {
            throw new Error('User not authenticated'); 
        }
        const followData = {
            userId: user.id,
            recipeId: recipeId,
            recipeName: recipeName,
        };
        const newFav = await Favorite.create(followData);
        res.status(200).json({recipe: recipeName})
    }
    catch(error){
        res.status(500).json({error: "Server Error"});
    }
})

export default router;
