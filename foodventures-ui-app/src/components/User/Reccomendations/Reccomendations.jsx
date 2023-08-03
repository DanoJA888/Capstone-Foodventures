import React from "react";
import { Link } from 'react-router-dom';
import Spinner from "../../Spinner.jsx";
import "./Reccomendations.css"


export default function Reccomendations({isLoading, reccomendations}) {
  return(
    <div className="col-md-5 mb-4 favs-and-reccs"> 
      <h1>Recipes You Might Like</h1>
        {isLoading ? (
          <Spinner/>
        ) : reccomendations.length == 0 ? (
          <p>No reccomendations to load</p>
        ) :
        (
          <div>
            {reccomendations.map((rec) => {
              const recipeId = rec.recipeId;
              return (
                <div>
                  <Link to= {`/searched/${recipeId}`}><h2>{rec.label}</h2></Link>
                </div>
              );
            })}
          </div>
        )}
    </div>
  )
}