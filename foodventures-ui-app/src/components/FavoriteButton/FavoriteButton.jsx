import React from "react";
import { recipeInfoForFavorating } from "../../../constant";

export default function FavoriteButton({favorited, setFavorited, recipe, recipeId, mainIngredient, secondaryIngredient}) {  
    async function addToFavs() {
    try {
      const recipeDetails = await recipeInfoForFavorating(recipe);
      console.log(recipeDetails);
      const response = await fetch(`http://localhost:3001/add_favorites`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            recipeId, 
            recipeName: recipe.label, 
            recipeCuisine: recipeDetails.cuisine,
            mainIngredient: mainIngredient,
            secondaryIngredient: secondaryIngredient,
            calories: recipeDetails.calories,
            image: {
              link: recipeDetails.image
            }
        }),
        credentials: "include",
      });
      setFavorited(true);
    } catch (error) {
      console.log(error);
    }
  }
  async function removeFromFavs() {
    const recipeDetails = await recipeInfoForFavorating(recipe);
    try {
      const response = await fetch(`http://localhost:3001/remove_favorites`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            recipeId, 
            recipeCuisine: recipeDetails.cuisine,
            mainIngredient:mainIngredient,
            secondaryIngredient: secondaryIngredient,
            calories: recipeDetails.calories
        }),
        credentials: "include",
      });
      setFavorited(false);
    } catch (error) {
      alert({ error });
    }
  }
  return(
    <div>
      {favorited ? (
        <button className="btn btn-danger btn-block" onClick={() => removeFromFavs()}>Remove From Favorites</button>
      ) : (
        <button className="btn btn-success btn-block"onClick={() => addToFavs()}>Add To Favorites</button>
      )}
    </div>
  )
}