import express from "express";
import { Recipe } from "../models/recipe.js";
import { Cuisine } from "../models/cuisine.js";
import { uuid } from "uuidv4";
import axios from "axios";


const router = express.Router();

router.post("/scrape_recipe", async (req, res) =>{
  const {recipeLink} = req.body;
  try{
    console.log(recipeLink)
    const response = await axios.get(recipeLink);
    const html = response.data;
    console.log(html);
    res.status(200).json(html)
  }
  catch(error){
    res.status(500).json({error: "Recipe Unavailable: " + error});
  }

})
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
        const recipeId = uuid();
        const code = cuisine.replaceAll(" ", "%20");

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