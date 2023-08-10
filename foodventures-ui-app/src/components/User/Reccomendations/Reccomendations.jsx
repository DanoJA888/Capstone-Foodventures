import React from "react";
import { Link } from 'react-router-dom';
import Spinner from "../../Spinner.jsx";
import "./Reccomendations.css"


export default function Reccomendations({isLoading, recommendations}) {
  console.log(recommendations);
  return(
    <div className="col-md-5 mb-4 favs-and-reccs"> 
      <h1>Recipes You Might Like</h1>
        {isLoading ? (
          <Spinner/>
        ) : recommendations.length == 0 ? (
          <p>No recommendations to load</p>
        ) :
        (
          <div>
            {recommendations.map((recommendation) => {
              // using substring method to extract recipeId, ternary to check if recipe is from db or external api
              return (
                <div className="col-md-12">
                  <div className=" text-center">
                    <img src={recommendation.image} alt={recommendation.label} className="img-fluid border border-dark" />
                    <Link to={`/searched/${recommendation.recipeId}`}>
                      <h2 >{recommendation.label}</h2>
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