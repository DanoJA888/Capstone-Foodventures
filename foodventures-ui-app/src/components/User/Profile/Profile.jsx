import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../UserContext.js";
import { Link } from 'react-router-dom';
import "./Profile.css";

export default function Profile() {
  const { currUser } = useContext(UserContext);
  const [currFavs, setFavs] = useState([]);
  
  const fetchFavorites = async () => {
    const response = await fetch("http://localhost:3001/get_favorites", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    setFavs(data);
  };
    
  useEffect(() => {
    fetchFavorites();
  }, []);
  console.log(currFavs);

  return (
    <div>
      <p>Profile</p>
      <div>
        <div>
          <p>USERNAME {currUser.username}</p>
          <p>EMAIL {currUser.email}</p>
          <p>
            NAME {currUser.firstName} {currUser.lastName}
          </p>
          <p>
            HEIGHT {currUser.heightFt}'{currUser.heightIn}
          </p>
          <p>WEIGHT {currUser.weight} lbs</p>
        </div>
        <div>
            <h1>Favorites</h1>
          {currFavs.length === 0 && (
            <div>
              <p>No Favorites</p>
            </div>
          )}
          {currFavs && (
            <div>
              {currFavs.map((fav) => {
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
      </div>
    </div>
  );
}
