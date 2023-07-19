import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext.js";
import { API_ID, API_KEY } from "../../../constant.js";
import axios from "axios";

export default function RecipeInfo() {
  const { recipeId } = useParams();
  const { currUser } = useContext(UserContext);
  const [favorited, setFavorited] = useState(false);
  console.log(recipeId);
  const [recipe, setRecipe] = useState({
    ingredientLines: [],
  });

  async function addToFavs() {

    try {
      const response = await fetch(`http://localhost:3001/add_favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId, recipeName: recipe.label, recipeCuisine: recipe.cuisineType[0]}),
        credentials: "include",
      });
      setFavorited(true);
      alert("Added to Favorites");
    } catch (error) {
      alert({ error });
    }
  }
  async function removeFromFavs() {

    try {
      const response = await fetch(`http://localhost:3001/remove_favorites`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId, recipeCuisine: recipe.cuisineType[0]}),
        credentials: "include",
      });
      setFavorited(false);
      alert("Removed from Favorites");
    } catch (error) {
      alert({ error });
    }
  }

  const apiCall = async () => {
    console.log(recipeId);
    const response = await fetch(
      `https://api.edamam.com/api/recipes/v2/${recipeId}?type=public&app_id=${API_ID}&app_key=${API_KEY}`
    );
    const data = await response.json();
    console.log(data.recipe);
    setRecipe(data.recipe);
  };

  const checkInFavs = async () => {
    const response = await fetch("http://localhost:3001/check_favorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipeId: recipeId }),
      credentials: "include",
    });
    const data = await response.json();
    setFavorited(Object.keys(data).length !== 0);
  };

  useEffect(() => {
    apiCall();
    checkInFavs();
  }, [recipeId, favorited]);

  return (
    <div>
        <div>
            <img src={recipe.image} alt={recipe.label} />
            <h1>{recipe.label}</h1>
            <h2>{recipe.source}</h2>

            {recipe.ingredientLines.map((ingredient) => (
            <p>{ingredient}</p>
            ))}

            <a href={recipe.url} target="_blank">
            Recipe
            </a>
        </div>
        {currUser && 
            <div>
                {favorited ? (
                    <button onClick={() => removeFromFavs()}>Remove From Favorites</button>
                ) : (
                    <button onClick={() => addToFavs()}>Add To Favorites</button>
                )}
            </div>
        }
    </div>
  );
}
