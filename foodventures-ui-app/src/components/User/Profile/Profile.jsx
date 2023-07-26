import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../UserContext.js";
import { Link } from 'react-router-dom';
import "./Profile.css";
import {API_ID, API_KEY} from "../../../../constant.js";
import { url } from "../../../../constant.js";

export default function Profile() {
  const { currUser } = useContext(UserContext);
  const [currFavs, setFavs] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [reccomendations, setReccs] = useState([]);
  const [cuisinesFetched, setCuisinesFetched] = useState(false);
  const [ingredientsFetched, setIngredientsFetched] = useState(false);
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
    if(data.topCuisines.length > 0){
      setCuisinesFetched(true);
    }
  };
  
  const topIngs = async () => {
    const response = await fetch("http://localhost:3001/user_ings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    console.log(data.topIngs);
    setIngredients(data.topIngs);
    if(data.topIngs.length > 0){
      setIngredientsFetched(true);
    }
  };
  

  const showReccs = async () =>{
    let possibleReccs = [];
    const checkIngs = new Set(ingredients);
    for(let i = 0; i < cuisines.length; i++){
      const responseCuisine = await fetch(url({cuisine: cuisines[i]}));
      const dataCuisine = await responseCuisine.json();
      possibleReccs = possibleReccs.concat(dataCuisine.hits);

    }
    
    let reccs = [];
    console.log(checkIngs);
    let takenIdx = new Set();
    console.log(possibleReccs);
    possibleReccs.forEach((option, index) => {
      option.recipe.ingredients.forEach((ing) => {
        if(checkIngs.has(ing.food)){
          reccs.push(option);
          takenIdx.add(index);
        }
      })
    })

    while(takenIdx.size < 8){
      const idx = Math.floor(Math.random()*possibleReccs.length);
      if(!takenIdx.has(idx)){
        reccs.push(possibleReccs[idx]);
        takenIdx.add(idx)
      }
    }
     
    console.log(reccs);
    console.log(takenIdx);
    setReccs(reccs);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchFavorites();
    topCuisines();
    topIngs(); 
  },[]);
  // since i have an awaiting expression to fetch the users favorite cuisines and the showReccs function is an async function, 
  // I have to wait for the cuisines to update in the state in order to make the external api calls.
  useEffect(() => {
    if (cuisinesFetched && ingredientsFetched && reccomendations.length === 0) {
      console.log(reccomendations);
      showReccs();
    }
  }, [cuisinesFetched, ingredientsFetched])


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
          {currFavs.length !== 0 &&
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
          }
          </div>
        </div>
      </div>
    </div>
  );
}
