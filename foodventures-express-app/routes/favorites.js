import express from "express";
import { Favorite } from "../models/favorites.js";
import { User } from "../models/user.js";

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
        let userCuisines = user.favCuisines;
        let userIngs = user.favIngs;

        
        const {recipeId, recipeName, recipeCuisine, highestWeight} = req.body;
        if (!user) {
            throw new Error('User not authenticated'); 
        }
        
        {userCuisines[recipeCuisine] ? 
          (userCuisines[recipeCuisine] +=1) 
          : 
          (userCuisines[recipeCuisine] =1)
        }
        
        {userIngs[highestWeight.food] ? 
          (userIngs[highestWeight.food] +=1) 
          : 
          (userIngs[highestWeight.food] =1)
        }
        console.log(JSON.stringify(highestWeight) + " hi");
        console.log(highestWeight.food + " ho");
        
        const updatedCount = await User.update(
          {
            favCuisines: userCuisines,
            favIngs: userIngs
          },
          {where: { id: user.id }}
        );
        const followData = {
            userId: user.id,
            recipeId: recipeId,
            recipeName: recipeName,
        };
        const newFav = await Favorite.create(followData);
        
        res.status(200).json({userIngs: highestWeight.food})

    }
    catch(error){
        res.status(500).json({error: "Server Error: " + error});
    }
})

router.delete("/remove_favorites", async (req, res) =>{
    
    try{
        const user = req.session.user;
        let userCuisines = user.favCuisines;
        let userIngs = user.favIngs;
        
        const {recipeId, recipeCuisine, highestWeight} = req.body;
        if (!user) {
            throw new Error('User not authenticated'); 
        }
        {userCuisines[recipeCuisine] === 1 ? 
          (delete userCuisines[recipeCuisine]) 
          : 
          (userCuisines[recipeCuisine] -=1)
        }
        {userIngs[highestWeight.food] === 1 ? 
          (delete userIngs[highestWeight.food]) 
          : 
          (userIngs[highestWeight.food] -=1)
        }

        const updatedCount = await User.update(
          {
            favCuisines: userCuisines,
            favIngs: userIngs,
          },
          {where: { id: user.id }}
        );
        const favorite = await Favorite.findOne({ where: { userId: user.id, recipeId: recipeId} });
        await favorite.destroy();
        res.status(200).json({favorite: favorite});

    }
    catch(error){
        res.status(500).json({error: "Server Error: " + error});
    }
})

export default router;
