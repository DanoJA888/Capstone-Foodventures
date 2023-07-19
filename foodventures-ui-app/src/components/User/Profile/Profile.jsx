import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../UserContext.js";
import { Link } from 'react-router-dom';
import "./Profile.css";
import {API_ID, API_KEY} from "../../../../constant.js";

export default function Profile() {
  const { currUser } = useContext(UserContext);
  const [currFavs, setFavs] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [reccomendations, setReccs] = useState([]);
  const [cuisinesFetched, setCuisinesFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  
  const fetchFavorites = async () => {
    const response = await fetch("http://localhost:3001/get_favorites", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    setFavs(data);
  };

  const topCuisines = async () => {
    const response = await fetch("http://localhost:3001/user_cuisines", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    console.log(data.topCuisines)
    setCuisines(data.topCuisines);
    setCuisinesFetched(true)
  };

  const showReccs = async () =>{
    let url = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${API_ID}&app_key=${API_KEY}`;
    let possibleReccs = [];
    // for loop to fetch recipes from differen cuisines and concats them to an array, where i can hold 60 recipes (important for random cuisine pull)
    for(let i = 0; i < cuisines.length; i++){
      const response = await fetch(url+`&cuisineType=${cuisines[i]}`);
      const data = await response.json();
      possibleReccs = possibleReccs.concat(data.hits);
    }
    let reccs = [];
    //randomly select 8 recipes from my pool of recipes
    for(let i = 0; i < 8; i++){
      reccs.push(possibleReccs[Math.floor(Math.random()*possibleReccs.length)]);
    }
    console.log(reccs)
    setReccs(reccs);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchFavorites();
    topCuisines();
    
  },[]);
  // since i have an awaiting expression to fetch the users favorite cuisines and the showReccs function is an async function, 
  // I have to wait for the cuisines to update in the state in order to make the external api calls.
  useEffect(() => {
    if (cuisinesFetched && reccomendations.length === 0) {
      console.log(reccomendations);
      showReccs();
    }
  }, [cuisinesFetched])


  return (
    <div>
      <p>Profile</p>
      <div>
        <div>
          <p>USERNAME {currUser.username}</p>
          <p>EMAIL {currUser.email}</p>
          <p>
            NAME {currUser.firstName} {currUser.lastName}
          </p>
          <p>
            HEIGHT {currUser.heightFt}'{currUser.heightIn}
          </p>
          <p>WEIGHT {currUser.weight} lbs</p>
        </div>
        <div>
            <h1>Favorites</h1>
          {currFavs.length === 0 && (
            <div>
              <p>No Favorites</p>
            </div>
          )}
          {currFavs && (
            <div>
              {currFavs.map((fav) => {
                const recipeId = fav.recipeId;
                return (
                  <div>
                    <Link to= {`/searched/${recipeId}`}><h2>{fav.recipeName}</h2></Link>
                  </div>
                );
              })}
            </div>
          )}
          <div>
          {isLoading ? (
            <p>Loading recommendations...</p>
          ) : (
            <div>
              <h1>Recipes You Might Like</h1>
              {reccomendations.map((rec) => {
                const recipeId = rec._links.self.href.substring(38, 71);
                return (
                  <div>
                    <Link to= {`/searched/${recipeId}`}><h2>{rec.recipe.label}</h2></Link>
                  </div>
                );
              })}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
