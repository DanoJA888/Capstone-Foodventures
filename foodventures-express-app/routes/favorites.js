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
        let mainIngredients = user.mainIngredients;
        let secondaryIngredients = user.secondaryIngredients;
        let calorieList = user.minAndMaxCals;
        
        const {recipeId, recipeName, recipeCuisine, mainIngredient, secondaryIngredient, calories, image} = req.body;
        if (!user) {
            throw new Error('User not authenticated'); 
        }
        
        
        {userCuisines[recipeCuisine] ? 
          (userCuisines[recipeCuisine] +=1) 
          : 
          (userCuisines[recipeCuisine] =1)
        }
        
        {mainIngredients[mainIngredient.toLowerCase()] ? 
          (mainIngredients[mainIngredient.toLowerCase()] +=1) 
          : 
          (mainIngredients[mainIngredient.toLowerCase()] =1)
        }
        {secondaryIngredients[secondaryIngredient.toLowerCase()] ? 
          (secondaryIngredients[secondaryIngredient.toLowerCase()] +=1) 
          : 
          (secondaryIngredients[secondaryIngredient.toLowerCase()] =1)
        }

        calorieList.push(calories);
        const followData = {
          userId: user.id,
          recipeId: recipeId,
          recipeName: recipeName,
          image: image.link
        };
        
        const [updatedCount, newFav] = await Promise.all([
          User.update(
            {
              favCuisines: userCuisines,
              mainIngredients: mainIngredients,
              secondaryIngredients: secondaryIngredients, 
              minAndMaxCals: calorieList,
            },
            {where: { id: user.id }}
          ),
          Favorite.create(followData)
        ]);
        res.status(200).json({user: user})

    }
    catch(error){
        res.status(500).json({error: "Server Error: " + error});
    }
})

router.delete("/remove_favorites", async (req, res) =>{
    
    try{
        const user = req.session.user;
        let userCuisines = user.favCuisines;
        let mainIngredients = user.mainIngredients;
        let secondaryIngredients = user.secondaryIngredients;
        let calorieList = user.minAndMaxCals;
        
        const {recipeId, recipeCuisine, mainIngredient, secondaryIngredient, calories} = req.body;
        if (!user) {
            throw new Error('User not authenticated'); 
        }
        {userCuisines[recipeCuisine] === 1 ? 
          (delete userCuisines[recipeCuisine]) 
          : 
          (userCuisines[recipeCuisine] -=1)
        }

        {mainIngredients[mainIngredient.toLowerCase()] === 1 ? 
          (delete mainIngredients[mainIngredient.toLowerCase()]) 
          : 
          (mainIngredients[mainIngredient.toLowerCase()] -=1)
        }
        {secondaryIngredients[secondaryIngredient.toLowerCase()] === 1 ? 
          (delete secondaryIngredients[secondaryIngredient.toLowerCase()]) 
          : 
          (secondaryIngredients[secondaryIngredient.toLowerCase()] -=1)
        }

        const indexToRemove = calorieList.indexOf(calories);
        if (indexToRemove !== -1) {
          calorieList.splice(indexToRemove, 1);
        }

        const updatedCount = await User.update(
          {
            favCuisines: userCuisines,
            mainIngredients: mainIngredients,
            secondaryIngredients: secondaryIngredients,
            minAndMaxCals: calorieList,
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
