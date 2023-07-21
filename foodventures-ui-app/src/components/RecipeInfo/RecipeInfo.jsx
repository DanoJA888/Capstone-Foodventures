import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext.js";
import { url } from "../../../constant.js";

export default function RecipeInfo() {
  const { recipeId } = useParams();
  const { currUser } = useContext(UserContext);
  const [favorited, setFavorited] = useState(false);
  const [recipe, setRecipe] = useState({
    ingredientLines: [],
  });
  const [highestWeight, setHighestWeight] = useState({
    food: "",
    foodCategory: "",
    foodId: "",
    image: "",
    measure: "",
    quantity: 0,
    text: "",
    weight: 0
  });


  async function addToFavs() {

    try {
      const response = await fetch(`http://localhost:3001/add_favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          recipeId, 
          recipeName: recipe.label, 
          recipeCuisine: recipe.cuisineType[0],
          highestWeight: highestWeight,
        }),
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
        body: JSON.stringify({ 
          recipeId, 
          recipeCuisine: recipe.cuisineType[0],
          highestWeight:highestWeight,
        }),
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
      url(recipeId, null, null)
    );
    const data = await response.json();
    setRecipe(data.recipe);
    let currHighestWeight = { weight: 0 };
    data.recipe.ingredients.forEach(ingredient => {
      if (ingredient.weight >currHighestWeight.weight ){
        currHighestWeight = ingredient
      }
    });
    setHighestWeight(currHighestWeight);
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