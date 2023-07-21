import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../UserContext.js";
import { Link } from 'react-router-dom';
import "./Home.css";

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
    setCuisines(data);
  };

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
            return(
              <Link to={`search_results`}><button onClick={() =>updateCuisine(cuisine.cusineCode)}>{cuisine.cuisineName}</button></Link>
            )
          })
        }
      </div>
    </div>
  );
}
