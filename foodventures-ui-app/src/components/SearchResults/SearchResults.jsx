import React, { useEffect, useState } from "react";
import "./SearchResults.css";
import {API_ID, API_KEY} from "../../../constant.js";
import { Link, useParams } from 'react-router-dom';
import SearchParams from "../SearchParams/SearchParams";

export default function SearchResults({cuisine, search, updateSearch}) {
  const {request} = useParams();
  const [currRecipes, updateRecipes] = useState([]);

  let url = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${API_ID}&app_key=${API_KEY}`;
    
  {if (cuisine){
      url += `&cuisineType=${cuisine}`;
  }}
  {if (search){
      url += `&q=${search}`;
  }}
  const apiCall = async () =>{
      const response = await fetch(url);
      const data = await response.json();
      updateRecipes(data.hits);
  };

  useEffect(() =>{
    apiCall();
  }, [cuisine, search]);

  return (
    <div>
        <h1>Search</h1>
        <div>
          <SearchParams updateSearch={updateSearch}/>
        </div>
        {cuisine !== "" &&
          <h1>{cuisine}</h1>
        }
        <div>
          {currRecipes.map((recipe) =>{
            //using substring method to extract recipeId
              const recipeId = recipe._links.self.href.substring(38, 71);
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