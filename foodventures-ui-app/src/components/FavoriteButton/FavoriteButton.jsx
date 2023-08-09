import React from "react";

export default function FavoriteButton({favorited, setFavorited, recipe, recipeId, mainIngredient, secondaryIngredient}) {
  async function addToFavs() {
    try {
      const calories = (recipe.calories / recipe.yield);
      const response = await fetch(`http://localhost:3001/add_favorites`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            recipeId, 
            recipeName: recipe.label, 
            recipeCuisine: recipe.cuisineType[0],
            mainIngredient: mainIngredient,
            secondaryIngredient: secondaryIngredient,
            calories: calories,
            image: {
              link: recipe.image
            }
        }),
        credentials: "include",
      });
      setFavorited(true);
    } catch (error) {
      alert({ error });
    }
  }
  async function removeFromFavs() {
    const calories = (recipe.calories / recipe.yield);
    try {
      const response = await fetch(`http://localhost:3001/remove_favorites`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            recipeId, 
            recipeCuisine: recipe.cuisineType[0],
            mainIngredient:mainIngredient,
            secondaryIngredient: secondaryIngredient,
            calories: calories
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