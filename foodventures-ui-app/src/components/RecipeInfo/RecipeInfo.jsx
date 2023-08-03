import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext.js";
import { url, calculateDifficulty, difficultyFactorMessage} from "../../../constant.js";
import FavoriteButton from "../FavoriteButton/FavoriteButton.jsx";
import IngredientsAndDirections from "../IngredientsAndDirections/IngredientsAndDirections.jsx";
import "./RecipeInfo.css";

export default function RecipeInfo() {
  const { recipeId } = useParams();
  const { currUser } = useContext(UserContext);
  const [favorited, setFavorited] = useState(false);
  const [recipeFetched, setRecipeFetched] = useState(false);
  const [isScraped, setIsScraped] = useState(false);
  const [recipeScrape, setRecipeScrape] = useState([]);
  const [urlSupported, setUrlSupported] = useState(true);
  const [mainIngredient, setMainIngredient] = useState("");
  const [secondaryIngredient, setSecondaryIngredient] = useState("");
  const [loadStatus, setLoadStatus] = useState(true);
  const [recipe, setRecipe] = useState({
    ingredientLines: [],
  });
  const [difficultyCalculated, setDifficultyCalculated] = useState(false);
  const [difficulty, setDifficulty] = useState({
    difficulty : "",
    factors: 0
  });

  const scrape = async () =>{
    if(recipe.directions){
      setRecipeScrape(recipe.directions);
    }
    else{
      const response = await fetch(`http://localhost:3001/scrape_recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          recipeLink: recipe.url,
        })
      });
      const directions = await response.json();
      console.log(directions);
      if (Array.isArray(directions) && directions.length > 0) {
        setRecipeScrape(directions);
      } else {
        console.error("Invalid data format:", directions);
        setUrlSupported(false);
      }
    }
    setIsScraped(true);
  }

  const apiCall = async () => {
    console.log(recipeId);
    const response = await fetch(url({recipeId}));
    if (response.ok) {
      const recipeInfo = await response.json();
      setRecipe(recipeInfo.recipe);
      findMainIngredients(recipeInfo.recipe);
      setRecipeFetched(true);
    } 
    else if (response.status === 404) {
      const dbSearch = await fetch(`http://localhost:3001/get_recipe?recipeId=${recipeId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const recipeInfo= await dbSearch.json();
      console.log(recipeInfo.recipe);
      if (recipeInfo.recipe) {
        setRecipe(recipeInfo.recipe);
        findMainIngredients(recipeInfo.recipe);
      } else {
        console.error('Recipe not found in both APIs');
      }
      setRecipeFetched(true);
    }
  };

  function findMainIngredients(recipe){
    let currMainIng = { weight: 0 };
    let currSecondaryIng = {weight : 0}
    recipe.ingredients.forEach(ingredient => {
      if (ingredient.weight >currMainIng.weight ){
        currMainIng = ingredient
      }
      else if(ingredient.weight >currSecondaryIng.weight ){
        currSecondaryIng = ingredient;
      }
    });
    console.log(currMainIng.food);
    console.log(currSecondaryIng.food);
    setMainIngredient(currMainIng.food);
    setSecondaryIngredient(currSecondaryIng.food);
  }

  const checkInFavs = async () => {
    const response = await fetch("http://localhost:3001/check_favorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipeId: recipeId }),
      credentials: "include",
    });
    const data = await response.json();
    setFavorited(Object.keys(data).length !== 0);
  };

  const storeRecipeInfo = async () =>{
    try{
    const storeRecipe = await fetch(`http://localhost:3001/store_recipe_info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipeId: recipeId,
        cuisine: "hello",
        difficulty: difficulty,
        recipe: recipe
      })
    });
    const recipeInfo= await storeRecipe.json();
  } catch (error) {
    console.error("Error while storing recipe info:", error);
  }
  }
  
  const checkIfRecipeStored = async () =>{
    const dbSearch = await fetch(`http://localhost:3001/get_recipe?recipeId=${recipeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const recipeInfo= await dbSearch.json();
    return recipeInfo;
  }
  const removeRecipeFromDB = async () =>{
    try{
      const dbSearch = await fetch(`http://localhost:3001/remove_recipe_info`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipeId: recipeId
        })
      });
    } catch (error) {
      console.error("Error while storing recipe info:", error);
    }
  }

  const executeStorage = async () => {
    if(recipeFetched && isScraped && difficultyCalculated){
      setLoadStatus(false);
      const checkingExistanceOfRewcipe = await checkIfRecipeStored();
      console.log(checkingExistanceOfRewcipe);
      if(!checkingExistanceOfRewcipe){
        await storeRecipeInfo();
        const cacheTimeout = setTimeout(() => {removeRecipeFromDB()}, 60000);
      }
    }
  };

  useEffect(() => {
    /*const inCache = localStorage.getItem(`searched/${recipeId}`)
    console.log(inCache)
    if(inCache){
      const cachedInfo = JSON.parse(inCache);
      setRecipe(cachedInfo.recipe);
      findMainIngredients(cachedInfo.recipe);
      setRecipeScrape(cachedInfo.recipeScrape);
      setRecipeFetched(true);
      setIsScraped(true);
      setUrlSupported(cachedInfo.recipeScrape.length > 1);
      setDifficulty(cachedInfo.difficulty);
    }*/
    apiCall();
    checkInFavs();
  }, [recipeId]);

  useEffect(() =>{
    console.log(mainIngredient);
    if(recipeFetched && !isScraped){
      scrape();
    }
    if (recipeFetched && isScraped) {
      setDifficulty(calculateDifficulty(recipe.ingredientLines, recipeScrape));
      setDifficultyCalculated(true);
    }
  }, [recipeFetched, isScraped]);

  useEffect(() =>{
    /*if(recipeFetched && isScraped && difficulty){
      setLoadStatus(false);
      const cachedInfo = {
        recipe,
        recipeScrape,
        difficulty
      };
      localStorage.setItem(`searched/${recipeId}`, JSON.stringify(cachedInfo));
      const cacheTimeout = setTimeout(() => {localStorage.removeItem(`searched/${recipeId}`);}, 60000);
    }*/
    executeStorage();
  }, [recipeFetched, isScraped, difficultyCalculated]);

  return (
      <div class="px-5 py-3">
        <div className="row">
          <div class="pill col-md-1 d-flex align-items-center justify-content-start">
            <span 
              class={`pill ${difficulty.difficulty}`}
              data-tooltip= {difficultyFactorMessage[difficulty.factors]}>
              {difficulty.difficulty}
            </span>
          </div>
          <div className="col-md-10 d-flex align-items-center justify-content-center"> 
            <h1 class="title">{recipe.label}</h1>
          </div>
          {currUser && 
            <div className="col-md-1 d-flex align-items-center justify-content-end">
              <FavoriteButton recipeId = {recipeId} recipe = {recipe} favorited = {favorited} setFavorited = {setFavorited} mainIngredient = {mainIngredient} secondaryIngredient = {secondaryIngredient}/>
            </div>
          }
        </div>
        <div className="container text-center">
          <img src={recipe.image} alt={recipe.label} />
          <p>{recipe.source}</p>
          <IngredientsAndDirections recipe = {recipe} recipeScrape={recipeScrape} loadStatus= {loadStatus} urlSupported= {urlSupported}/>
        </div>
      </div>
  );
}