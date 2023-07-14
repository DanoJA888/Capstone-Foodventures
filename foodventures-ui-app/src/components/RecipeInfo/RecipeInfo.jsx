import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext.js";
import {API_ID, API_KEY} from "../../../constant.js";
import axios from 'axios';

export default function RecipeInfo() {
  const { recipeId } = useParams();
  const { currUser } = useContext(UserContext);
  console.log(recipeId)
  const [recipe, setRecipe] = useState({
    ingredientLines: []
  });
  
  async function addToFavs(event) {
    event.preventDefault();

    try{
        const response = await fetch(`http://localhost:3001/add_favorites`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ recipeId, recipeName: recipe.label }),
            credentials: 'include'
        });
        alert("Added to Favorites");
    }
    catch(error){
        alert({error});
    }
  }

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
        {currUser && 
            <div>
                <button onClick={(event) => addToFavs(event)}>Add To Favorites</button>
            </div>
        }
    </div>
  );
}
