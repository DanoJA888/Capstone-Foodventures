import "./RecipeGrid.css";
import React from "react";
import { Link } from 'react-router-dom';
import { Card } from "react-bootstrap";

export default function RecipeGrid({currRecipes}){

  return(
    <div className="row">
      {currRecipes.length == 0 ? (
        <h5 className="text-center">No Recipes Found</h5>
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
            <div className="col-md-3 d-flex justify-content-center mb-4">
              <Card style={{ width: '15rem', border: '2px solid', borderColor: '#4fb354', height: '325px'}}>
                <Card.Img variant="top" src={recipe.recipe.image} />
                <Card.Body>
                <Link className="link" to={`/searched/${recipeId}`}>
                  <p className="text-center text-primary">{recipe.recipe.label}</p>
                </Link>
                </Card.Body>
              </Card>
            </div>
          );
        })
      )}
    </div>
  )
}