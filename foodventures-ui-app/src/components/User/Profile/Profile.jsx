import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../UserContext.js";
import "./Profile.css";

export default function Profile() {
  const { currUser } = useContext(UserContext);
  const [currFavs, setFavs] = useState([]);
  
    
  useEffect(() => {
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
            NAME {currUser.first_name} {currUser.last_name}
          </p>
          <p>
            HEIGHT {currUser.height_ft}'{currUser.height_in}
          </p>
          <p>WEIGHT {currUser.weight} lbs</p>
        </div>
        <div>
          {currFavs.length === 0 && (
            <div>
              <p>No Favorites</p>
            </div>
          )}
          {currFavs && (
            <div>
              {currFavs.map((fav) => {
                return (
                  <div>
                    <p>{fav.recipeName}</p>
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
