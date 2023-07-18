import express from "express";
import { Recipe } from "../models/recipe.js";
import { Cuisine } from "../models/cuisine.js";


const router = express.Router();

router.post("/add_recipe", async (req, res) => {
    const {
        recipeName,
        recipeSource,
        ingredientLines,
        directions,
        url,
        calories,
        servings,
        cuisine
        } = req.body;
    
    try {
        const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
        let recipeId = "";
        const code = cuisine.replaceAll(" ", "%20");
    
        for (let i = 0; i < 31; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            recipeId += characters.charAt(randomIndex);
        }
        const user = req.session.user;
        const checkCuisine = await Cuisine.findOne({where: {cuisineName : cuisine}});
        if(!checkCuisine){
          
          const cuisineData = {
              cuisineName : cuisine,
              cusineCode: code
          }
          const newCuisine = await Cuisine.create(cuisineData);
        }
      const newRecipe = await Recipe.create({
        userId: user.id,
        recipeId,
        recipeName,
        recipeSource,
        ingredientLines,
        directions,
        url,
        calories,
        servings,
        cuisine
      });
      res.status(200).json({recipeId: recipeId, cuisine: code})
    }
    catch(error){
        res.status(500).json({error: "Server Error: " + error});
    }
});

export default router;