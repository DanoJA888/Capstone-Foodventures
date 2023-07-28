import express from "express";
import { url } from "../constant.js";


const router = express.Router();

//
function rankByPoints(c1, c2) {
  return c2 - c1;
}

router.post("/generate_reccomendations", async (req, res) => {
    const {
      mainIngredients,
      cuisines
    } = req.body;
  
    try {
      let possibleReccomendations = [];
      console.log(cuisines);
      const weights = [.45, .35, .20];
      let ingredientWeight = {};
      mainIngredients.forEach((ingredient, index) => {
          ingredientWeight[ingredient] = weights[index];
      });
      console.log(ingredientWeight);
      const mainIngredientsSet = new Set(mainIngredients);
      for(let i = 0; i < cuisines.length; i++){
        const responseCuisine = await fetch(url({cuisine: cuisines[i]}));
        const dataCuisine = await responseCuisine.json();
        possibleReccomendations = possibleReccomendations.concat(dataCuisine.hits);
  
      }
      // check each recipes mainIngredients to see if users fave ings are included
      // sacrifice performance for accuracy 
      let reccomendations = [];
      console.log(mainIngredientsSet);
      let takenIdx = new Set();
      possibleReccomendations.forEach((option, index) => {
        let recipeWithPoint = {
          label : option.recipe.label,
          recipeId : option._links.self.href.substring(38, 71),
          points : 0
        }
        option.recipe.ingredients.forEach((ing) => {
  
          if(mainIngredientsSet.has(ing.food.toLowerCase())){
            //reccomendations.push(option);
            //takenIdx.add(index);
  
            recipeWithPoint['points'] += ingredientWeight[ing.food.toLowerCase()];
          }
        })
        if(recipeWithPoint.points > 0){
          reccomendations.push(recipeWithPoint);
          takenIdx.add(index);
        }
      })
      console.log(reccomendations);
      // avoids repeating recipes
      while(takenIdx.size < 8){
        const idx = Math.floor(Math.random()*possibleReccomendations.length);
        if(!takenIdx.has(idx)){
          //reccomendations.push(possibleReccomendations[idx]);
          reccomendations.push(
            {
              label : possibleReccomendations[idx].recipe.label,
              recipeId : possibleReccomendations[idx]._links.self.href.substring(38, 71),
              points : 0
            }
          )
          takenIdx.add(idx);
        }
      }
      reccomendations.sort((point1, point2) => rankByPoints(point1.points, point2.points));
      res.status(200).json(reccomendations.slice(0, 8));
    } catch (error) {
      res.status(500).json({ error: "Server error" +error });
    }
  });

export default router;
