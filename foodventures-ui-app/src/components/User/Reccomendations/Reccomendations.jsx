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
            {reccomendations.map((reccomendation) => {
              // using substring method to extract recipeId, ternary to check if recipe is from db or external api
              return (
                <div className="col-md-12">
                  <div className=" text-center">
                    <img src={reccomendation.image} alt={reccomendation.label} className="img-fluid" />
                    <Link to={`/searched/${reccomendation.recipeId}`}>
                      <h2 >{reccomendation.label}</h2>
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