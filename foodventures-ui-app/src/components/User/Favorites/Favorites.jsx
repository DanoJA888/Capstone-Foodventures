import React from "react";
import { Link } from 'react-router-dom';

export default function Favorites({favorites}) {
  return(
    <div className="col-md-5 mb-4 favs-and-reccs">
      <h1>Favorites</h1>
      {favorites.length === 0 ? (
        <div>
          <p>No Favorites</p>
        </div>
      ):(
        <div>
            {favorites.map((fav) => {
              // using substring method to extract recipeId, ternary to check if recipe is from db or external api
              return (
                <div className="col-md-12">
                  <div className=" -4 text-center">
                    <Link to={`/searched/${fav.recipeId}`}>
                      <h2 >{fav.recipeName}</h2>
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  )
}