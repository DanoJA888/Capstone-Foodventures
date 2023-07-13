import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import {API_ID, API_KEY} from "../../../constant.js";

export default function RecipeInfo() {
  const { recipeId } = useParams();
  console.log(recipeId)
  const [recipe, setRecipe] = useState({
    ingredientLines: []
  });
  

  useEffect(() => {
    const apiCall = async () => {
        console.log(recipeId)
      const response = await fetch(`https://api.edamam.com/api/recipes/v2/${recipeId}?type=public&app_id=${API_ID}&app_key=${API_KEY}`);
      const data = await response.json();
      console.log(data.recipe);
      setRecipe(data.recipe);
    };
    apiCall();
  }, [recipeId]);

  return (
    <div>
        <div>
            <img src={recipe.image} alt={recipe.label} />
            <h1>{recipe.label}</h1>
            <h2>{recipe.source}</h2>

            {
                recipe.ingredientLines.map(ingredient=>
                <p>{ingredient}</p>
                )
            }

            <a href={recipe.url} target="_blank">Recipe</a>
        </div>
        <div>
            <button>Add To Favorites</button>
        </div>
    </div>
  );
}
