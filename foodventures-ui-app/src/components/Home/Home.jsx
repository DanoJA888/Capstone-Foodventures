import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../UserContext.js";
import { Link } from 'react-router-dom';
import { fetchCuisines } from "../../../constant.js";
import "./Home.css";

export default function Home({updateCuisine}) {
  const { currUser, updateUser } = useContext(UserContext);
  const [cuisines, setCuisines] = useState([]);
  const getCuisines = async () => {
    const data = await fetchCuisines();
    setCuisines(data);
  };

  useEffect(() => {
    getCuisines();
  }, []);

  return (
  <div >
    <h1 className="title">Discover Dishes From Around the World!</h1>
    <div className="row mt-3 mx-4 justify-content-center">
      {cuisines.map((cuisine) => (
        <div className="col-md-4 d-flex justify-content-center">
          <Link to={`search_results`} className="text-decoration-none text-dark link-cuisine">
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