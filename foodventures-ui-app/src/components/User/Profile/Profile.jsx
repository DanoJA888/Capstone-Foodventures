import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../UserContext.js";
import { Link } from 'react-router-dom';
import "./Profile.css";
import {API_ID, API_KEY} from "../../../../constant.js";
import { url } from "../../../../constant.js";

export default function Profile() {
  const { currUser } = useContext(UserContext);
  const [favs, setFavs] = useState([]);
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

  const  topCuisines = async () => {
   const fetchedCuisine = await fetchCuisine();
   if(fetchedCuisine.length == 0){
     setIsLoading(false);
   }
   else{
     setCuisines(fetchedCuisine);
     setCuisinesFetched(true);
   }
  };

  const fetchCuisine = async () =>{
    const response = await fetch("http://localhost:3001/user_cuisines", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    console.log(data.topCuisines);
    return data.topCuisines;
  }
  
  const topIngs = async () => {
    const fetchedIngs = await fetchIngs();
    if(fetchedIngs.length == 0){
      setIsLoading(false);
    }
    else{
      setIngredients(fetchedIngs);
      setIngredientsFetched(true);
    }
    };
  
  const fetchIngs = async () =>{
    const response = await fetch("http://localhost:3001/user_ings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    return data.topIngs;
  }

  const showReccs = async () =>{
    let possibleReccs = [];
    console.log(cuisines);
    const checkIngs = new Set(ingredients);
    for(let i = 0; i < cuisines.length; i++){
      const responseCuisine = await fetch(url({cuisine: cuisines[i]}));
      const dataCuisine = await responseCuisine.json();
      possibleReccs = possibleReccs.concat(dataCuisine.hits);

    }
    // check each recipes ingredients to see if users fave ings are included
    // sacrifice performance for accuracy 
    let reccs = [];
    console.log(checkIngs);
    let takenIdx = new Set();
    possibleReccs.forEach((option, index) => {
      option.recipe.ingredients.forEach((ing) => {
        if(checkIngs.has(ing.food.toLowerCase())){
          reccs.push(option);
          takenIdx.add(index);
        }
      })
    })
    // avoids repeating recipes
    while(takenIdx.size < 8){
      const idx = Math.floor(Math.random()*possibleReccs.length);
      if(!takenIdx.has(idx)){
        reccs.push(possibleReccs[idx]);
        takenIdx.add(idx)
      }
    }
    console.log(takenIdx);
    setReccs(reccs);
    setIsLoading(false);
  }
  
  function allInfoMatches(fetched, cached) {
    const allFetchedInCache = [...fetched].every(fetch => cached.has(fetch));
    const allCachedInFetch = [...cached].every(cache => fetched.has(cache));
    return allFetchedInCache && allCachedInFetch;
  }

  const noChangeForReccs = async (cachedCuisine, cachedIngs) =>{
    const cachedCuisineSet = new Set(cachedCuisine);
    const cachedIngSet = new Set(cachedIngs);
    const fetchedCuisine = new Set(await fetchCuisine());
    const fetchedIngs = new Set(await fetchIngs());
    const cuisinesMatch = allInfoMatches(fetchedCuisine, cachedCuisineSet)
    const ingredientMatch = allInfoMatches(fetchedIngs, cachedIngSet)
    return (cuisinesMatch && ingredientMatch)
  }

  useEffect(() => {
    const inCache = localStorage.getItem(`profile/${currUser.username}`);
    const determineCacheAction = async () => {
      if (inCache) {
        console.log(reccomendations);
        const profileInfo = JSON.parse(inCache);
        const noChange = await noChangeForReccs(profileInfo.cuisines, profileInfo.ingredients);
        if (noChange) {
          console.log("no, this is running");
          fetchFavorites();
          setReccs(profileInfo.reccomendations);
          setIngredients(profileInfo.ingredients);
          setCuisines(profileInfo.cuisines);
          setIsLoading(false);
        } else {
          console.log("this is running");
          fetchFavorites();
          topCuisines();
          topIngs();
        }
      }
      else {
        fetchFavorites();
        topCuisines();
        topIngs(); 
      }
    };
  
    determineCacheAction();
  }, []);

  // since i have an awaiting expression to fetch the users favorite cuisines and the showReccs function is an async function, 
  // I have to wait for the cuisines to update in the state in order to make the external api calls.
  useEffect(() => {
    console.log(isLoading);
    if (cuisines.length !== 0 && ingredients.length !== 0) {
      showReccs();
    }
  }, [cuisinesFetched, ingredientsFetched])

  useEffect(() =>{
    console.log(reccomendations);
    if (reccomendations.length > 0){
      const cachedInfo = {
        ingredients,
        cuisines,
        reccomendations
      };
      localStorage.setItem(`profile/${currUser.username}`, JSON.stringify(cachedInfo));
      const cacheTimeout = setTimeout(() => {localStorage.removeItem(`profile/${currUser.username}`);}, 60000);
    }
  }, [reccomendations]);

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
          {favs.length === 0 && (
            <div>
              <p>No Favorites</p>
            </div>
          )}
          {favs && (
            <div>
              {favs.map((fav) => {
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
          
            <div>
            <h1>Recipes You Might Like</h1>
              {isLoading ? (
                <p>Loading recommendations...</p>
              ) : reccomendations.length == 0 ? (
                <p>No reccomendations to load</p>
              ) :
              (
                <div>
                  
                  
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
    </div>
  );
}
