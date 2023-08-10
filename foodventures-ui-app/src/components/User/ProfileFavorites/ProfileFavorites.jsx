import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../UserContext.js";
import "./ProfileFavorites.css";
import Favorites from "../Favorites/Favorites.jsx";
import Reccomendations from "../Reccomendations/Reccomendations.jsx";
import { groupRecipes } from "../../../../constant.js";


export default function ProfileFavorites() {
  const { currUser } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [mainIngredients, setMainIngredients] = useState([]);
  const [secondaryIngredients, setSecondaryIngredients] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [cuisinesFetched, setCuisinesFetched] = useState(false);
  const [mainIngredientsFetched, setMainIngredientsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [calorieRange, setCalorieRange] = useState([]);

  const fetchFavorites = async () => {
    const response = await fetch("http://localhost:3001/get_favorites", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const favs = await response.json();
    if (favs.length > 0) {
      const groupedRecipes = groupRecipes(favs);
      console.log(groupedRecipes);
      setFavorites(groupedRecipes);
    }
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
    return data.topCuisines;
  }
  
  const setInformaion = async () => {
    const [mainIngs, secondaryIngs, calRange] = await Promise.all([
      fetchMainIngredients(),
      fetchSecondaryIngredients(),
      fetchCalorieRange()
    ]);
    if(mainIngs.length == 0){
      setIsLoading(false);
    }
    else{
      setMainIngredients(mainIngs);
      setSecondaryIngredients(secondaryIngs);
      setMainIngredientsFetched(true);
      setCalorieRange(calRange);
    }
    };
  
  const fetchMainIngredients = async () =>{
    const response = await fetch("http://localhost:3001/get_main_ings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    return data.topThreeMain;
  }
  const fetchSecondaryIngredients = async () =>{
    const response = await fetch("http://localhost:3001/get_second_ings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    return data.topThreeSecondary;
  }
  const fetchCalorieRange = async () =>{
    const response = await fetch("http://localhost:3001/get_calorie_range", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    return data.calorieRange;
  }

  const generateReccomendations = async () =>{
    const response = await fetch("http://localhost:3001/generate_reccomendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body : JSON.stringify({mainIngredients, secondaryIngredients, cuisines, calorieRange}),
      credentials: "include",
    });
    const generatedRecommendations = await response.json();
    if (generatedRecommendations.length > 0) {
      const groupedRecipes = groupRecipes(generatedRecommendations);
      console.log(groupedRecipes);
      setRecommendations(groupedRecipes);
    }
    setIsLoading(false);
  }
  
  function allInfoMatches(fetched, cached) {
    if(fetched.length === cached.length){
      const equal = fetched.every((val, idx) => val === cached[idx]);
      return equal;
    }
    return false;
  }
  const noChangeForReccs = async (cachedCuisine, cachedMainIngs, cachedSecondaryIngs, cachedCalorieRange) =>{
    const fetchedCuisine = await fetchCuisine();
    const fetchedMainIngredients = await fetchMainIngredients();
    const fetchedSecondaryIngredients = await fetchSecondaryIngredients();
    const fetchedCalorieRange = await fetchCalorieRange();
    const cuisinesMatch = allInfoMatches(fetchedCuisine, cachedCuisine);
    const mainIngredientMatch = allInfoMatches(fetchedMainIngredients, cachedMainIngs);
    const secondaryIngredientMatch = allInfoMatches(fetchedSecondaryIngredients, cachedSecondaryIngs);
    const calorieRangeMatch = allInfoMatches(fetchedCalorieRange, cachedCalorieRange)
    return (cuisinesMatch && mainIngredientMatch && secondaryIngredientMatch && calorieRangeMatch);
  }

  useEffect(() => {
    const inCache = localStorage.getItem(`profile/${currUser.username}`);
    const determineCacheAction = async () => {
      if (inCache) {
        const profileInfo = JSON.parse(inCache);
        const noChange = await noChangeForReccs(profileInfo.cuisines, profileInfo.mainIngredients, profileInfo.secondaryIngredients, profileInfo.calorieRange);
        if (noChange) {
          setRecommendations(profileInfo.recommendations);
          fetchFavorites();
          setMainIngredients(profileInfo.mainIngredients);
          setSecondaryIngredients(profileInfo.secondaryIngredients);
          setCuisines(profileInfo.cuisines);
          setCalorieRange(profileInfo.calorieRange);
          setIsLoading(false);
        } else {
          fetchFavorites();
          topCuisines();
          setInformaion();
        }
      }
      else {
        fetchFavorites();
        topCuisines();
        setInformaion(); 
      }
    };
  
    determineCacheAction();
  }, []);

  // since i have an awaiting expression to fetch the users favorite cuisines and the generateReccomendations function is an async function, 
  // I have to wait for the cuisines to update in the state in order to make the external api calls.
  useEffect(() => {
    if (cuisines.length !== 0 && mainIngredients.length !== 0) {
      generateReccomendations();
    }
  }, [cuisinesFetched, mainIngredientsFetched])

  useEffect(() =>{
    if (recommendations.length > 0){
      const cachedInfo = {
        mainIngredients,
        secondaryIngredients,
        cuisines,
        calorieRange,
        recommendations
      };
      localStorage.setItem(`profile/${currUser.username}`, JSON.stringify(cachedInfo));
      const recommendationsCacheTimeout = setTimeout(() => {localStorage.removeItem(`profile/${currUser.username}`);}, 600000);
    }
  }, [recommendations]);

  return (
    <div class="text-center justify-content-center">
      <h1>{currUser.username}'s Favorites</h1>
      <div class="px-5 py-3 container text-center justify-content-center">
      <Favorites favorites={favorites}/>
        <div className="row">
          <Reccomendations isLoading={isLoading} recommendations={recommendations}/>
        </div>
      </div>
    </div> 
  );
}