import React, { useEffect, useState } from "react";
import "./SearchResults.css";
import SearchParams from "../SearchParams/SearchParams";
import { url } from "../../../constant.js";
import Spinner from "../Spinner";
import RecipeGrid from "../RecipeGrid/RecipeGrid";

export default function SearchResults({cuisineList, cuisine, search, updateSearch, updateCuisine}) {
  const [currRecipes, updateRecipes] = useState([]);
  const [loadStatus, setLoadStatus] = useState(true);
  const [previousCuisine, setPreviousCuisine]= useState("");
  const [previousSearch, setPreviousSearch] = useState("");
  const [previousRecipes, setPreviousRecipes] = useState([]);

  const apiCall = async () =>{
    const responseInternalAPI = await fetch(`http://localhost:3001/get_recipes?cuisine=${cuisine}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setPreviousCuisine(cuisine);
    setPreviousSearch(search);
    let results = []
    const recipes = await responseInternalAPI.json();
    console.log(recipes);
    results = results.concat(recipes);
    const responseExternalApi = await fetch(url({cuisine, q: search}));
    const urlRecipes = await responseExternalApi.json();
    console.log(urlRecipes);
    results= results.concat(urlRecipes.hits)
    console.log(results);
    updateRecipes(results);
  };

  useEffect(() =>{
    if(previousCuisine !== cuisine || previousSearch !== search){
      setLoadStatus(true);
      apiCall();
    }
    else{
      setLoadStatus(false);
    }
  }, [cuisine, search, currRecipes]);

  return (
    <div>
        <h1 className="title">Search</h1>
        <div>
        <SearchParams cuisineList = {cuisineList} updateSearch = {updateSearch} updateCuisine = {updateCuisine}/>
        </div>
        {cuisine !== "" &&  
          <h1 className="title">{cuisine.replaceAll("%20", " ")}</h1>
        }
        <div className="container mt-3 mr-1">
          <div className="row">
            {loadStatus ? (
              <Spinner/>
            ) : (
              <RecipeGrid currRecipes={currRecipes}/>
            )}
          </div>
        </div>
    </div>
  )
}