import React, { useRef, useContext, useState } from "react";
import { UserContext } from "../../UserContext.js";
import "./UploadRecipe.css";
import { useNavigate } from 'react-router-dom';
import {calculateDifficulty} from "../../../../constant.js"

export default function UploadRecipe({cuisineList}) {
  const navigate = useNavigate();
  const { currUser } = useContext(UserContext);
  const ingRef = useRef(null);
  const ingQuant = useRef(null);
  const ingWeight = useRef(null);
  const directionsRef = useRef(null);
  const [newCuisine, setNewCuisine] = useState(false);
  //ingredientLines holds the entire text of each ingredient: ex) 1 apple
  // ingredients is more individual stored in arr of objects :
  //                  qty: 1
  //                  food: apple
  const [recipe, setRecipe] = useState({
    label: "Title",
    source: `${currUser.username} (User)`,
    ingredientLines: [],
    ingredients: [],
    directions: [],
    url: "",
    calories: 0,
    servings: 0,
    cuisine: "Cuisine",
    image: "https://static.thenounproject.com/png/526867-200.png"
  });

  async function uploadRecipe(event) {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/add_recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
        credentials: "include",
      });
      alert("Recipe Added");
      navigate('/');
    } catch (error) {
      alert({ error });
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({
      ...recipe,
      [name]: value,
    });
    setNewCuisine(value === "Other");
  };

  const addIng = (event, name) =>{
    event.preventDefault();
    //updates array with entire line
    const updatedIngredientList = [...recipe[name]];
    updatedIngredientList.push(ingQuant.current.value + " " + ingRef.current.value);
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      [name]: updatedIngredientList,
    }));
    //updates array with specific info seperated
    const updatedIngredients = [...recipe["ingredients"]];
    updatedIngredients.push({ 
      text: ingQuant.current.value + " " + ingRef.current.value,
      quantity : ingQuant.current.value,
      food : ingRef.current.value, 
      weight: ingWeight.current.value
    });
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      ["ingredients"]: updatedIngredients,
    }));
    
    ingQuant.current.value = "";
    ingRef.current.value = "";
    ingWeight.current.value = 0;
  }

  const removeIng = (event, ingredient) => {
    event.preventDefault();
    //updates array with entire line
    const updatedIngredients = [...recipe["ingredients"]];
    const index = updatedIngredients.indexOf(ingredient);
    updatedIngredients.splice(index, 1);
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      ["ingredients"]: updatedIngredients,
    }));
    //updates array with specific info seperated
    const updatedIngredientList = [...recipe["ingredientLines"]];
    updatedIngredientList.splice(index, 1);
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      ["ingredientLines"]: updatedIngredientList,
    }));
  }

  const addDirections = (event, name) =>{
    event.preventDefault();
    const updateDirections = [...recipe["directions"]];
    updateDirections.push(directionsRef.current.value);
    setRecipe({
      ...recipe,
      ["directions"]: updateDirections
    });
    directionsRef.current.value = "";
  }
  
  return (
    <div class="px-5 py-3 container text-center">
      <h1 class= "title">Upload A Recipe!</h1>
      <div className="row ">
          <div className="col-md-5 mb-4 form-box">
            <form onSubmit={uploadRecipe} >
              <h1>Enter Your Recipe Details</h1>
              <div>
                <label for="label" className="mb-2 fw-bold">Recipe Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="label"
                  name="label"
                  onChange={handleChange}
                  placeholder="Add Recipe Name..."
                  required
                />
              </div>
              <div className=" my-3 d-flex flex-column align-items-center">
                <label for="ingredientQuantity" className="mb-2 fw-bold">Add Ingredients</label>
                  <input
                  type="text"
                  className="form-control "
                  id="ingredientQuantity"
                  name="ingredientQuantity"
                  placeholder="Add Quantity..."
                  ref={ingQuant}
                />
                <input
                  type="text"
                  className="form-control"
                  id="ingredientLines"
                  name="ingredientLines"
                  placeholder="Add Ingredient..."
                  ref={ingRef}
                />
                <input
                  type="number"
                  step={1}
                  className="form-control"
                  id="ingredientWeight"
                  name="ingredientWeight"
                  placeholder="Add Ingredient Weight..."
                  ref={ingWeight}
                />
                <button 
                onClick={(event) => addIng(event, "ingredientLines")}
                className="btn btn-outline-dark btn-upload">
                  Add Ingredient
                </button>
              </div>
              
              <div>
              <label for="servings" className="mb-2 fw-bold">Food Portions</label>
                <input
                  type="number"
                  step={1}
                  className="form-control"
                  id="servings"
                  name="servings"
                  onChange={handleChange}
                  placeholder="Add Servings..."
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  step={1}
                  className="form-control"
                  id="calories"
                  name="calories"
                  onChange={handleChange}
                  placeholder="Add Calories..."
                  required
                />
              </div>
              <div className="my-3">
              <label for="cuisine" className="mb-2 fw-bold">Cuisine</label>
                <select
                  className="form-control"
                  id="cuisine"
                  name="cuisine"
                  value={recipe.cuisine}
                  onChange={handleChange}
                >
                  {cuisineList.map((cuisine) => (
                  <option value={cuisine.cusineCode}>
                      {cuisine.cuisineName}
                  </option>
                  ))}
                  <option value="Other">Other</option> 
                </select>

                {newCuisine && (
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter cuisine"
                    onChange={(event) =>
                      setRecipe({ ...recipe, cuisine: event.target.value })
                    }
                    required
                  />
                )}
              </div>
              <div className="my-3 d-flex flex-column align-items-center">
              <label for="directions" className="mb-2 fw-bold">Add Steps</label>
                <input 
                name="directions" 
                className="form-control"
                id="directions" 
                cols="30" 
                rows="10"
                placeholder="Recipe Directions..."
                ref={directionsRef}
                />
                <button 
                onClick={(event) => addDirections(event, "directions")}
                className="btn btn-outline-dark btn-upload">
                  Add Step
                </button>
              </div>
              <div className="d-flex flex-column align-items-center">
                <button type="submit"
                className="btn btn-outline-dark btn-upload"
                >Upload Recipe</button>
              </div>
            </form>
          </div>
        <div className="col-md-2 mb-4"></div>
        <div className="col-md-5 mb-4 recipe-box">
          <h1>Your Recipe</h1>
          <p className="mb-2 fw-bold">Recipe Name</p>
          <h2>{recipe.label}</h2>
          <p className="mb-2 fw-bold">Source</p>
          <h4 className="fw-normal">{recipe.source}</h4>
          <p className="mb-2 fw-bold">Ingredients</p>
          <div className="recipe-box">
            {
              recipe.ingredients.map((ingredient) => (
                <div className="ingredient-container">
                  <p>{ingredient.text}</p>
                  <button 
                  onClick={(event) => removeIng(event, ingredient)}
                  className="btn btn-outline-dark btn-remove"
                  >x</button>
                </div>
              ))
            }
          </div>
          <p className="mb-2 fw-bold">Servings </p> <h4 className="fw-normal">{recipe.servings}</h4>
          <p className="mb-2 fw-bold">Calories </p> <h4 className="fw-normal">{recipe.calories}</h4>
          <p className="mb-2 fw-bold">Cuisine </p> <h4 className="fw-normal">{recipe.cuisine.replace("%20", " ")}</h4>
          <p className="mb-2 fw-bold">Directions</p>
          <div className="recipe-box">
            {
              recipe.directions.map((step) => (
                  <p>{step}</p>
              ))
            }
          </div>
        </div>
      </div>
    </div>
);
}