import React, {useContext, useState, useEffect} from "react";
import { UserContext } from "../../UserContext.js";
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
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
      let groupedRecipes = [];
      for (let i = 0; i < recipes.length; i += 3) {
        const endOfGroup = i+3;
        const group = recipes.slice(i, endOfGroup);
        groupedRecipes.push(group);
        console.log(group);
      }
      console.log(groupedRecipes);
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
        <div class="col-md-6 info-box">
          <div class="col-md-3">
            <h1 className="fw-bold mb-0">{currUser.username}</h1> 
            <h3 className="mb-2">{currUser.firstName} {currUser.lastName}</h3>
            <h5> {currUser.email} </h5>
            <p className="mb-0">Height {currUser.heightFt}'{currUser.heightIn}</p>
            <p>Weight {currUser.weight} lbs</p>
          </div>
        </div>
      </div>
      <div class="row justify-content-center text-center p-4">
        <h1 class="p-4"> Your Uploaded Recipes</h1>
        {userUploadedRecipes.length == 0 ? (
          <h5 className="title">It Seems You Havent Uploaded Any Recipes Yet</h5>
          ):(
          <Carousel interval={5000} indicators={true} className="col-md-9 info-box">
            {userUploadedRecipes.map((recipes) => {
              return (
                <Carousel.Item>
                  <div className="d-flex justify-content-around">
                  {recipes.map((recipe) =>{
                    return(
                    <div className="border p-4 text-center bg-white">
                      <img src={recipe.recipe.image} alt={recipe.recipe.label} className="img-fluid" />
                      <Link className="link" to={`/searched/${recipe.recipeId}`}>
                        <p className="text-truncate text-primary">{recipe.recipe.label}</p>
                      </Link>
                    </div>
                  )})}
                  </div>
                </Carousel.Item>
              );
            })}
          </Carousel>
        )}
      </div>
    </div>
  )
}