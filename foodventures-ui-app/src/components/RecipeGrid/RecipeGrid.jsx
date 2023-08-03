import React from "react";
import { Link } from 'react-router-dom';

export default function RecipeGrid({currRecipes}){

  return(
    <div className="row">
      {currRecipes.length == 0 ? (
        <h5 className="title">No Recipes Found</h5>
        ):(
        currRecipes.map((recipe) => {
          // using substring method to extract recipeId, ternary to check if recipe is from db or external api
          let recipeId = "";
          {recipe._links? (
            recipeId = recipe._links.self.href.substring(38, 71)
            ):(
            recipeId = recipe.recipeId
          )}
          return (
            <div className="col-md-3">
              <div className="border p-4 text-center">
                <img src={recipe.recipe.image} alt={recipe.recipe.label} className="img-fluid" />
                <Link to={`/searched/${recipeId}`}>
                  <h2 className="text-truncate">{recipe.recipe.label}</h2>
                </Link>
              </div>
            </div>
          );
        })
      )}
    </div>
  )
}