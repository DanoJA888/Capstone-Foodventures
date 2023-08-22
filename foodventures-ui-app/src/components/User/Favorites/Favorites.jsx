import React from "react";
import { Link } from 'react-router-dom';
import RecipeCarousel from "../../RecipeCarousel.jsx";

export default function Favorites({favorites}) {
  return(
    <div className="col-md-12 justify-content-center py-4">
      <h1>Favorites</h1>
      {favorites.length === 0 ? (
        <div>
          <p>No Favorites</p>
        </div>
      ):(
        <RecipeCarousel groupedRecipes={favorites}/>
      )}
    </div>
  )
}