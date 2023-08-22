import express from "express";
import { url } from "../constant.js";


const router = express.Router();

//
function rankByPoints(c1, c2) {
  return c2 - c1;
}

function calorieDistanceCalculation(max, min, option){
  const optionCalories = option.recipe.calories / option.recipe.yield;
  console.log(optionCalories)
  if (min <= optionCalories && optionCalories <= max) {
    return 1.0;
  } else if (optionCalories < min){
    return optionCalories / min;
  } else{
    return max / optionCalories;
  }
}

router.post("/generate_reccomendations", async (req, res) => {
    const {
      mainIngredients,
      secondaryIngredients,
      cuisines,
      calorieRange
    } = req.body;
  
    try {
      
      let possibleReccomendations = [];
      console.log(cuisines);
      const weights = [.45, .35, .20];

      let mainIngredientWeight = {};
      mainIngredients.forEach((ingredient, index) => {
          mainIngredientWeight[ingredient] = weights[index];
      });
      let secondIngredientWeights = {};
      secondaryIngredients.forEach((ingredient, index) => {
        secondIngredientWeights[ingredient] = weights[index];
      });

      console.log(mainIngredientWeight);
      console.log(secondIngredientWeights);
      const mainIngredientsSet = new Set(mainIngredients);
      const secondaryIngredientsSet = new Set(secondaryIngredients);
      for(let i = 0; i < cuisines.length; i++){
        const responseCuisine = await fetch(url({cuisine: cuisines[i]}));
        const dataCuisine = await responseCuisine.json();
        possibleReccomendations = possibleReccomendations.concat(dataCuisine.hits);
      }
      // check each recipes mainIngredients to see if users fave ings are included
      // sacrifice performance for accuracy 
      let reccomendations = [];
      possibleReccomendations.forEach((option, index) => {
        let recipeWithPoint = {
          recipeName : option.recipe.label,
          image : option.recipe.image,
          recipeId : option._links.self.href.substring(38, 71),
          points : 0
        }
        option.recipe.ingredients.forEach((ing) => {

          if(mainIngredientsSet.has(ing.food.toLowerCase())){
            recipeWithPoint['points'] += mainIngredientWeight[ing.food.toLowerCase()] * .60;
          }
          if(secondaryIngredientsSet.has(ing.food.toLowerCase())){
            recipeWithPoint['points'] += secondIngredientWeights[ing.food.toLowerCase()] * .20;
          }
        })
        recipeWithPoint['points'] += calorieDistanceCalculation(calorieRange[0], calorieRange[1], option) * .20;
        if(recipeWithPoint.points > 0){
          reccomendations.push(recipeWithPoint);
        }
      })
      console.log(reccomendations);
      reccomendations.sort((point1, point2) => rankByPoints(point1.points, point2.points));
      res.status(200).json(reccomendations.slice(0, 8));
    } catch (error) {
      res.status(500).json({ error: "Server error" +error });
    }
  });

export default router;
