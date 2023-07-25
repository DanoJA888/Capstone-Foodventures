import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext.js";
import { url } from "../../../constant.js";
import cheerio from "cheerio";
import axios from "axios";
import "./RecipeInfo.css";

export default function RecipeInfo() {
  const { recipeId } = useParams();
  const { currUser } = useContext(UserContext);
  const [favorited, setFavorited] = useState(false);
  const [recipeFetched, setRecipeFetched] = useState(false);
  const [isScraped, setIsScraped] = useState(false);
  const [recipeScrape, setRecipeScrape] = useState([]);
  const [urlSupported, setUrlSupported] = useState(true);
  const [recipe, setRecipe] = useState({
    ingredientLines: [],
  });
  const [highestWeight, setHighestWeight] = useState({
    food: "",
    foodCategory: "",
    foodId: "",
    image: "",
    measure: "",
    quantity: 0,
    text: "",
    weight: 0
  });

  const scrape = async () =>{
    const response = await fetch(`http://localhost:3001/scrape_recipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        recipeLink: recipe.url,
      })
    });
    const data = await response.json();
    console.log(data);
    if (Array.isArray(data)) {
      setRecipeScrape(data);
      
    } else {
      console.error("Invalid data format:", data);
      setUrlSupported(false);
    }
    setIsScraped(true);
  }


  async function addToFavs() {

    try {
      const response = await fetch(`http://localhost:3001/add_favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          recipeId, 
          recipeName: recipe.label, 
          recipeCuisine: recipe.cuisineType[0],
          highestWeight: highestWeight,
        }),
        credentials: "include",
      });
      setFavorited(true);
      alert("Added to Favorites");
    } catch (error) {
      alert({ error });
    }
  }
  async function removeFromFavs() {

    try {
      const response = await fetch(`http://localhost:3001/remove_favorites`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          recipeId, 
          recipeCuisine: recipe.cuisineType[0],
          highestWeight:highestWeight,
        }),
        credentials: "include",
      });
      setFavorited(false);
      alert("Removed from Favorites");
    } catch (error) {
      alert({ error });
    }
  }

  const apiCall = async () => {
    console.log(recipeId);
    const response = await fetch(
      url(recipeId, null, null)
    );
    const data = await response.json();
    setRecipe(data.recipe);
    findHighestWeight(data.recipe);
    setRecipeFetched(true);
  };

  function findHighestWeight(recipe){
    let currHighestWeight = { weight: 0 };
    recipe.ingredients.forEach(ingredient => {
      if (ingredient.weight >currHighestWeight.weight ){
        currHighestWeight = ingredient
      }
    });
    setHighestWeight(currHighestWeight);
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

  useEffect(() => {
    const inCache = localStorage.getItem(`searched/${recipeId}`)
    if(inCache){
      const cachedInfo = JSON.parse(inCache);
      setRecipe(cachedInfo.recipe);
      findHighestWeight(cachedInfo.recipe);
      setRecipeScrape(cachedInfo.recipeScrape);
      setRecipeFetched(true);
      setIsScraped(true);
      setUrlSupported(cachedInfo.recipeScrape.length > 1);
    }
    else{
      apiCall();
    }
    checkInFavs();
  }, [recipeId, favorited]);

  useEffect(() =>{
    console.log(highestWeight);
    if(recipeFetched && !isScraped){
      scrape();
    }
  }, [recipeFetched, isScraped]);

  useEffect(() => {
    if (recipeFetched && isScraped) {
      const cachedInfo = {
        recipe,
        recipeScrape,
      };
      localStorage.setItem(`searched/${recipeId}`, JSON.stringify(cachedInfo));
      const cacheTimeout = setTimeout(() => {localStorage.removeItem(`searched/${recipeId}`);}, 60000);
    }
  }, [recipeFetched, isScraped]);

  return (
    <div>
      <div className="row">
          <div className="col-md-11 d-flex align-items-center justify-content-center"> 
            <h1 className="recipe-title">{recipe.label}</h1>
          </div>
          {currUser && 
            <div className="col-md-1 d-flex align-items-center justify-content-end">
              <div>
                {favorited ? (
                  <button className="btn btn-danger" onClick={() => removeFromFavs()}>Remove From Favorites</button>
                ) : (
                  <button className="btn btn-success"onClick={() => addToFavs()}>Add To Favorites</button>
                )}
              </div>
            </div>
          }
        </div>
      <div className="container text-center">
        <img src={recipe.image} alt={recipe.label} />
        <p>{recipe.source}</p>
        <div className="row ">
          <div className="col-md-6 mb-4">
            <h3>Ingredients</h3>
            <ul className="list-group">
              {recipe.ingredientLines.map((ingredient) => (
                <li className="list-group-item">{ingredient}</li>
              ))}
            </ul>
          </div>
          <div className="col-md-6 mb-4">
            <h3>Directions</h3>
            {!isScraped ? (
                <p>Loading Recipe Info...</p>
              ) : !urlSupported ? (
                <p>Unsupported URL</p>
              ) : (
                <div>
                  <ul className="list-group">
                    {recipeScrape.map((paragraph) => (
                      <li className="list-group-item">{paragraph}</li>
                    ))}
                  </ul>
                </div>
              )
            }
            <a href={recipe.url} target="_blank" className="btn btn-primary">
              Recipe
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}