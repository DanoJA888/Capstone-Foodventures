import React from "react";
import { Link } from 'react-router-dom';

export default function Favorites({favorites}) {
  return(
    <div className="col-md-5 mb-4 favs-and-reccs">
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
    </div>
  )
}