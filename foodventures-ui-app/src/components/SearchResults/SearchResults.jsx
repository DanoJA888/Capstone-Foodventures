import React, { useEffect, useState } from "react";
import "./SearchResults.css";
import {API_ID, API_KEY} from "../../../constant.js";
import { Link, useParams } from 'react-router-dom';
import SearchParams from "../SearchParams/SearchParams";
import { url } from "../../../constant.js";

export default function SearchResults({cuisine, search, updateSearch}) {
  const {request} = useParams();
  const [currRecipes, updateRecipes] = useState([]);

  const apiCall = async () =>{
      console.log(url(null, cuisine, search));
      const response = await fetch(url(null, cuisine, search));
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