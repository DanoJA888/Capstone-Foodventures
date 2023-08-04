import express, { response } from "express";
import { Recipe } from "../models/recipe.js";
import { Cuisine } from "../models/cuisine.js";
import { uuid } from "uuidv4";

const router = express.Router();

router.post("/add_recipe", async (req, res) => {
    const {
        label,
        recipeSource,
        ingredientLines,
        directions,
        url,
        calories,
        servings,
        cuisine
        } = req.body;
    console.log(req.body);
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
        recipe: req.body, 
        cuisine: cuisine
      });
      res.status(200).json({recipeId: recipeId, cuisine: code})
    }
    catch(error){
        res.status(500).json({error: "Server Error: " + error});
    }
});

router.get("/get_recipes", async (req, res) => {
  try {
    const cuisine = req.query.cuisine;
    const recipes = await Recipe.findAll({where: {cuisine : cuisine}});
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/get_recipe", async (req, res) => {
  try {
    const recipeId = req.query.recipeId;
    const recipe = await Recipe.findOne({where: {recipeId : recipeId}});
    res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.post("/store_recipe_info", async (req,res) =>{
  const {
    recipeId,
    cuisine,
    difficulty,
    recipe,
    scrape
    } = req.body;
  try{
    const newRecipeStored = await Recipe.create(
      {
        recipeId: recipeId,
        cuisine: cuisine,
        recipe: recipe,
        difficulty: difficulty,
        scrape: scrape
      }
    );
    
    res.status(200).json(recipe)
  }
  catch(error){
    console.error(error);
    res.status(500).json({error: "Server Error: " + error});
  }
})

router.delete("/remove_recipe_info", async (req, res) => {
  const {recipeId} = req.body;
  try{
    const favorite = await Recipe.findOne({ where: { userId: null, recipeId: recipeId} });
    await favorite.destroy();
    res.status(200).json({res: "destroyed"})
  }
  catch(error){
    console.error(error);
    res.status(500).json({error: "Server Error: " + error});
  }
})

export default router;