import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../UserContext.js";
import { Link } from 'react-router-dom';
import "./Home.css";
import axios from "axios";
//import {cuisines} from "../../../constant.js";

export default function Home({updateCuisine}) {
  const { currUser, updateUser } = useContext(UserContext);
  const [cuisines, setCuisines] = useState([]);
  const fetchCuisines = async () => {
    const response = await fetch("http://localhost:3001/get_cuisines", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    setCuisines(data);
  };
  
  function handleCuisine(cuisine){
    {updateCuisine(cuisine)};
  }

  useEffect(() => {
    fetchCuisines();
  }, []);

  return (
    <div className="home">
      <p>Home</p>
      <div>{currUser && <p>Welcome {currUser.username}</p>}</div>

      <div>
        {
          cuisines.map((cuisine) => {
            console.log(cuisine.cusineCode);
            return(
              <Link to={`search_results`}><button onClick={() => handleCuisine(cuisine.cusineCode)}>{cuisine.cuisineName}</button></Link>
            )
          })
        }
      </div>
    </div>
  );
}
/*{Object.entries(cuisines).map(([key, value])=> {
  return (
  <div>
    <Link to={`search_results`}><button onClick={() => handleCuisine(value)}>{key}</button></Link>
  </div>
  )
})}*/
