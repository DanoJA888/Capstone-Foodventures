import React, { useState, useContext } from "react";
import { UserContext } from "../UserContext.js";
import { Link } from 'react-router-dom';
import "./Home.css";
import axios from "axios";
import {cuisines} from "../../../constant.js";

export default function Home({chooseCuisine}) {
  const { currUser, updateUser } = useContext(UserContext);
  
  function handleCuisine(cuisine){
    {chooseCuisine(cuisine)};
  }


  return (
    <div className="home">
      <p>Home</p>
      <div>{currUser && <p>Welcome {currUser.username}</p>}</div>

      <div>
        {Object.entries(cuisines).map(([key, value])=> {
          return (
          <div>
            <Link to={`search_results`}><button onClick={() => handleCuisine(value)}>{key}</button></Link>
          </div>
          )
        })}
      </div>
    </div>
  );
}

