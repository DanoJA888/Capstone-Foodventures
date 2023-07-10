import React, { useEffect, useState, useContext } from "react";
import "./Search.css"
import { UserContext } from '../UserContext';
import {API_ID, API_KEY} from "../../../constant.js";

export default function Search({cuisine}) {
  const { currUser, updateUser } = useContext(UserContext);
  const [currRecipes, updateRecipes] = useState([])
  console.log(cuisine);
  let url = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${API_ID}&app_key=${API_KEY}`

  {if (cuisine){
    url += `&cuisineType=${cuisine}` 
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
          {currRecipes.map((bigboy) =>{
              return (
                <div>
                  <h2>{bigboy.recipe.label}</h2>
                </div>
              )
          })}
        </div>
    </div>
  )
}