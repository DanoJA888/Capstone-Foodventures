import React from "react";
import { Link } from 'react-router-dom';
import Spinner from "../../Spinner.jsx";
import "./Reccomendations.css"
import RecipeCarousel from "../../RecipeCarousel.jsx";


export default function Reccomendations({isLoading, recommendations}) {
  console.log(recommendations);
  return(
    <div className="col-md-12 py-4"> 
      <h1>Recipes You Might Like</h1>
        {isLoading ? (
          <Spinner/>
        ) : recommendations.length == 0 ? (
          <p>No recommendations to load</p>
        ) :
        (
          <div>
            <RecipeCarousel groupedRecipes={recommendations}/>
          </div>
        )}
    </div>
  )
}