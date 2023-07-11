import React, { useEffect, useState, useContext } from "react";
import "./Search.css"
import { UserContext } from '../UserContext';
import {API_ID, API_KEY} from "../../../constant.js";
import { Link } from 'react-router-dom';
import RecipeInfo from "../RecipeInfo/RecipeInfo";

export default function Search({cuisine}) {
  const { currUser, updateUser } = useContext(UserContext);
  const [currRecipes, updateRecipes] = useState([]);


  console.log(cuisine);
  let url = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${API_ID}&app_key=${API_KEY}`;

  {if (cuisine){
    url += `&cuisineType=${cuisine}`;
  }}

  useEffect(() =>{
    const apiCall = async () =>{
        const response = await fetch(url);
        const data = await response.json();
        console.log(data.hits[0].recipe.label);
        updateRecipes(data.hits);
    };
    apiCall();
  }, []);

  return (
    <div>
        <h1>Search</h1>
        {cuisine !== "" &&
          <h1>{cuisine}</h1>
        }
        <div>
          {currRecipes.map((recipe) =>{
              const recipeId = recipe._links.self.href.substring(38, 71);
              console.log(recipeId)
              return (
                <div>
                  <Link to= {`/search/${recipeId}`}><h2>{recipe.recipe.label}</h2></Link>
                </div>
              )
          })}
        </div>
    </div>
  )
}