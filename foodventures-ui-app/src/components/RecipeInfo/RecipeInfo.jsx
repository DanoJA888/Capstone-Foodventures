import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext.js";
import { url, calculateDifficulty, difficultyFactorMessage} from "../../../constant.js";
import FavoriteButton from "../FavoriteButton/FavoriteButton.jsx";
import IngredientsAndDirections from "../IngredientsAndDirections/IngredientsAndDirections.jsx";
import "./RecipeInfo.css";
import Card from 'react-bootstrap/Card';

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
  const [cuisine, setCuisine] = useState("");
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

      if (Array.isArray(directions) && directions.length > 0) {
        setRecipeScrape(directions);
      } else {
        setUrlSupported(false);
      }
    }
    setIsScraped(true);
  }

  const apiCall = async () => {
    const response = await fetch(url({recipeId}));
    if (response.ok) {
      const recipeInfo = await response.json();
      console.log(recipeInfo)
      setRecipe(recipeInfo.recipe);
      setCuisine(recipeInfo.recipe.cuisineType[0]);
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
      if (recipeInfo.recipe) {
        setRecipe(recipeInfo.recipe);
        setCuisine(recipeInfo.cuisine)
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
    if(recipe.ingredients.length === 1){
      setMainIngredient(recipe.ingredients[0].food);
      setSecondaryIngredient(recipe.ingredients[0].food);
    }
    else{
      recipe.ingredients.forEach(ingredient => {
        const ingredientWeight = parseFloat(ingredient.weight);
        if (ingredientWeight >currMainIng.weight ){
          const temp = currMainIng;
          currMainIng = ingredient;
          if (temp.weight > currSecondaryIng.weight){
            currSecondaryIng = temp;
          }
        }
        else if(ingredientWeight >currSecondaryIng.weight ){
          currSecondaryIng = ingredient;
        }
        
      });
      setMainIngredient(currMainIng.food);
      setSecondaryIngredient(currSecondaryIng.food);
    }
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
        difficulty: difficulty,
        recipe: recipe,
        scrape: recipeScrape
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
      const isRecipeInDb = await checkIfRecipeStored();
      if(!isRecipeInDb){
        await storeRecipeInfo();
        const cacheTimeout = setTimeout(() => {removeRecipeFromDB()}, 300000);
      }
    }
  };

  const displayStoredRecipe = async () => {
    const confirmingRecipeExistance = await checkIfRecipeStored();
    if(confirmingRecipeExistance !== null){
      setRecipe(confirmingRecipeExistance.recipe);
      {confirmingRecipeExistance.userId !== undefined && confirmingRecipeExistance.userId !== null
        ? setCuisine(confirmingRecipeExistance.cuisine)
        : setCuisine(confirmingRecipeExistance.recipe.cuisineType[0]);}
      findMainIngredients(confirmingRecipeExistance.recipe);
      setRecipeScrape(confirmingRecipeExistance.scrape);
      setRecipeFetched(true);
      setIsScraped(true);
      setUrlSupported(confirmingRecipeExistance.scrape.length > 1);
      if(!confirmingRecipeExistance.userId){
        setDifficulty(confirmingRecipeExistance.difficulty);
      }
      else{
        setDifficulty(calculateDifficulty(confirmingRecipeExistance.recipe.ingredientLines, confirmingRecipeExistance.recipe.directions));
      }
      setDifficultyCalculated(true);
    }
    else{
      apiCall();
    }
    checkInFavs();
  };

  useEffect(() => {
    displayStoredRecipe();
  }, [recipeId]);

  useEffect(() =>{
    if(recipeFetched && !isScraped){
      scrape();
    }
    if (recipeFetched && isScraped) {
      setDifficulty(calculateDifficulty(recipe.ingredientLines, recipeScrape));
      setDifficultyCalculated(true);
    }
  }, [recipeFetched, isScraped]);

  useEffect(() =>{
    executeStorage();
    
  }, [recipeFetched, isScraped, difficultyCalculated]);
  
  return (
      <div class="px-5 py-3">
        <div className="row">
          <div class="pill col-md-1 d-flex align-items-center justify-content-start">
            <h5 style={{ padding: '12px', marginTop: "4px"}}>Difficulty:</h5>
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
        <div className="container my-5">
          <div className="row">
            <div className="col-md-6">
              <Card style={{ width: '30rem', border: '2px solid', borderColor: 'black' }}>
                <Card.Img variant="top" src={recipe.image} />
                <Card.Body>
                  <strong>Cuisine:</strong> {cuisine} | <strong>Main Ingredients:</strong> {mainIngredient}, {secondaryIngredient}
                </Card.Body>
              </Card>
              <p className="source">Source: {recipe.source}</p>
            </div>
            <div className="col-md-6 d-flex flex-column justify-content-center border border-dark border-2 rounded">  
              <IngredientsAndDirections recipe={recipe} recipeScrape={recipeScrape} loadStatus={loadStatus} urlSupported={urlSupported} />
            </div>
          </div>
        </div>
      </div>
  );
}