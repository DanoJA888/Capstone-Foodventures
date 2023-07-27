import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../UserContext.js";
import { Link } from 'react-router-dom';
import "./Profile.css";
import {API_ID, API_KEY} from "../../../../constant.js";
import { url } from "../../../../constant.js";

export default function Profile() {
  const { currUser } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [reccomendations, setReccomendations] = useState([]);
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
    setFavorites(data);
  };

  const topCuisines = async () => {
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
  
  const topIngredients = async () => {
    const fetchedIngredients = await fetchIngredients();
    if(fetchedIngredients.length == 0){
      setIsLoading(false);
    }
    else{
      setIngredients(fetchedIngredients);
      setIngredientsFetched(true);
    }
    };
  
  const fetchIngredients = async () =>{
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

  const generateReccomendations = async () =>{
    let possibleReccomendations = [];
    console.log(cuisines);
    const ingredientsSet = new Set(ingredients);
    for(let i = 0; i < cuisines.length; i++){
      const responseCuisine = await fetch(url({cuisine: cuisines[i]}));
      const dataCuisine = await responseCuisine.json();
      possibleReccomendations = possibleReccomendations.concat(dataCuisine.hits);

    }
    // check each recipes ingredients to see if users fave ings are included
    // sacrifice performance for accuracy 
    let reccomendations = [];
    console.log(ingredientsSet);
    let takenIdx = new Set();
    possibleReccomendations.forEach((option, index) => {
      option.recipe.ingredients.forEach((ing) => {
        if(ingredientsSet.has(ing.food.toLowerCase())){
          reccomendations.push(option);
          takenIdx.add(index);
        }
      })
    })
    // avoids repeating recipes
    while(takenIdx.size < 8){
      const idx = Math.floor(Math.random()*possibleReccomendations.length);
      if(!takenIdx.has(idx)){
        reccomendations.push(possibleReccomendations[idx]);
        takenIdx.add(idx)
      }
    }
    console.log(takenIdx);
    setReccomendations(reccomendations);
    setIsLoading(false);
  }
  
  function allInfoMatches(fetched, cached) {
    const allFetchedInCache = [...fetched].every(fetch => cached.has(fetch));
    const allCachedInFetch = [...cached].every(cache => fetched.has(cache));
    console.log("This is the result you get, is it what you expect?",allFetchedInCache && allCachedInFetch)
    return allFetchedInCache && allCachedInFetch;
  }

  const noChangeForReccs = async (cachedCuisine, cachedIngs) =>{
    const cachedCuisineSet = new Set(cachedCuisine);
    const cachedIngSet = new Set(cachedIngs);
    const fetchedCuisine = new Set(await fetchCuisine());
    const fetchedIngredients = new Set(await fetchIngredients());
    console.log(cachedCuisineSet);
    console.log(cachedIngSet);
    console.log(fetchedCuisine);
    console.log(fetchedIngredients);
    const cuisinesMatch = allInfoMatches(fetchedCuisine, cachedCuisineSet)
    const ingredientMatch = allInfoMatches(fetchedIngredients, cachedIngSet)
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
          setReccomendations(profileInfo.reccomendations);
          fetchFavorites();
          setIngredients(profileInfo.ingredients);
          setCuisines(profileInfo.cuisines);
          setIsLoading(false);
        } else {
          console.log("this is running");
          fetchFavorites();
          topCuisines();
          topIngredients();
        }
      }
      else {
        fetchFavorites();
        topCuisines();
        topIngredients(); 
      }
    };
  
    determineCacheAction();
  }, []);

  // since i have an awaiting expression to fetch the users favorite cuisines and the generateReccomendations function is an async function, 
  // I have to wait for the cuisines to update in the state in order to make the external api calls.
  useEffect(() => {
    console.log(isLoading);
    if (cuisines.length !== 0 && ingredients.length !== 0) {
      generateReccomendations();
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
      const reccomendationsCacheTimeout = setTimeout(() => {localStorage.removeItem(`profile/${currUser.username}`);}, 600000);
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
          {favorites.length === 0 && (
            <div>
              <p>No Favorites</p>
            </div>
          )}
          {favorites && (
            <div>
              {favorites.map((fav) => {
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
