import React from "react";
import { Link } from 'react-router-dom';

import "./Home.css";

export default function Home({cuisineList, updateCuisine}) {

  return (
  <div>
    <h1 class= "text-center p-4">Discover Dishes From Around the World!</h1>
    <div className="row mt-3 mx-4 justify-content-center">
      {cuisineList.map((cuisine) => (
        <div className="col-md-4 d-flex justify-content-center">
          <Link to={`/search_results/cuisine/${cuisine.cusineCode}/search/`} className="text-decoration-none text-dark link-cuisine">
              <button
                className="btn btn-outline-dark btn-cuisine"
                onClick={() => updateCuisine(cuisine.cusineCode)}
              >
                {cuisine.cuisineName}
              </button>
            </Link>
      </div>
      ))}
    </div>
  </div>
);}