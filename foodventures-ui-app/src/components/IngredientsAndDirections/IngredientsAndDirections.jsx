import React from "react";

export default function IngredientsAndDirections({recipe, recipeScrape, loadStatus, urlSupported}) {
  return(
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
        {loadStatus ? (
            <div class="d-flex justify-content-center spinner-view">
              <div class="spinner-border" role="status">
              </div>
            </div>
          ) : !urlSupported ? (
            <div>
              <p>Unsupported URL</p>
              <a href={recipe.url} target="_blank" className="btn btn-primary">
                Recipe
              </a>
            </div>
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
      </div>
    </div>
  )
}