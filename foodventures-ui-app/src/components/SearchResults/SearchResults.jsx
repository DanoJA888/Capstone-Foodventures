import React, { useEffect, useState, useContext } from "react";
import "./SearchResults.css"
import {API_ID, API_KEY} from "../../../constant.js";
import { Link, useParams } from 'react-router-dom';
import SearchParams from "../SearchParams/SearchParams";

export default function SearchResults({cuisine}) {
    const {request} = useParams();
    const params = request.split('_');
    const cuisineSelected = params[0];
    const search = params[1];
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
        <div>
          <SearchParams/>
        </div>
        {cuisine !== "" &&
          <h1>{cuisine}</h1>
        }
        <div>
          {currRecipes.map((recipe) =>{
              const recipeId = recipe._links.self.href.substring(38, 71);
              console.log(recipeId)
              return (
                <div>
                  <Link to= {`/searched/${recipeId}`}><h2>{recipe.recipe.label}</h2></Link>
                </div>
              )
          })}
        </div>
    </div>
  )
}