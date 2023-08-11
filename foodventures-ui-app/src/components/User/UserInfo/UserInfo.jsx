import React, {useContext, useState, useEffect} from "react";
import { UserContext } from "../../UserContext.js";
import { Link } from 'react-router-dom';
import { groupRecipes } from "../../../../constant.js";
import RecipeCarousel from "../../RecipeCarousel.jsx";
import './UserInfo.css'

export default function UserInfo() {
  const { currUser } = useContext(UserContext);
  const [userUploadedRecipes, setUserUploadedRecipes] = useState([]);

  const fetchUserUploadedRecipes = async () => {
    const response = await fetch("http://localhost:3001/get_user_uploaded", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const recipes = await response.json();
    console.log(recipes);
    if (recipes.length > 0) {
      const groupedRecipes = groupRecipes(recipes);
      setUserUploadedRecipes(groupedRecipes);
    }
  };

  useEffect(() => {
    fetchUserUploadedRecipes();
  }, [])

  return(
    <div class="container ">
      <h1 class= "text-center p-4">Your Profile Info</h1>
      <div class="row justify-content-center">
        <div class="row col-md-6 info-box">
          <div class="col-md-6">
            <h1 className="fw-bold mb-0">{currUser.username}</h1> 
            <h3 className="mb-2">{currUser.firstName} {currUser.lastName}</h3>
            <h5> {currUser.email} </h5>
            <p className="mb-0">Height {currUser.heightFt}'{currUser.heightIn}</p>
            <p>Weight {currUser.weight} lbs</p>
          </div>
          <div class="col-md-6 d-flex justify-content-end">
            <img src="https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg" 
            alt={userUploadedRecipes.username}
            className="profile-pic" />
          </div>
        </div>
      </div>
      <div class="row justify-content-center text-center p-4">
        <h1 class="p-4"> Your Uploaded Recipes</h1>
        {userUploadedRecipes.length == 0 ? (
          <h5 className="title">It Seems You Havent Uploaded Any Recipes Yet</h5>
          ):(
          <RecipeCarousel groupedRecipes={userUploadedRecipes}/>
        )}
      </div>
    </div>
  )
}