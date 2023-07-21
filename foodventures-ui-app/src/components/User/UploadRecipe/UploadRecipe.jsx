import React, { useRef, useContext, useState } from "react";
import { UserContext } from "../../UserContext.js";
import "./UploadRecipe.css";

export default function UploadRecipe({ resetCuisine, resetSearch }) {
    const { currUser } = useContext(UserContext);
    const ingRef = useRef(null);
    const ingQuant = useRef(null);
    const directionsRef = useRef(null);
    const [recipe, setRecipe] = useState({
        recipeName: "",
        recipeSource: `Username: ${currUser.username}`,
        ingredientLines: [],
        directions: "",
        url: "",
        calories: 0,
        servings: 0,
        cuisine: "",
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
        } catch (error) {
          alert({ error });
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        console.log(name);
        console.log(value);
            setRecipe({
                ...recipe,
                [name]: value,
            });
    };
    const addIng = (event, name) =>{
        event.preventDefault();
        const updatedList = [...recipe[name]];
        updatedList.push({ 
            "text": ingQuant.current.value + " " + ingRef.current.value,
            "quantity" : ingQuant.current.value,
            "food" : ingRef.current.value
        });
        setRecipe({
            ...recipe,
            [name]: updatedList,
        });
        ingQuant.current.value = "";
        ingRef.current.value = "";
    }
    const removeIng = (event, ingredient) => {
        event.preventDefault();
        const updatedList = [...recipe["ingredientLines"]];
        const index = updatedList.indexOf(ingredient);
        updatedList.splice(index, 1);
        setRecipe({
            ...recipe,
            ["ingredientLines"]: updatedList,
        });
    }
    const addDirections = (event, name) =>{
        event.preventDefault();
        setRecipe({
            ...recipe,
            [name]: directionsRef.current.value
        });
        directionsRef.current.value = "";
    }

    console.log(recipe);
    return (
        <div>
            <h1>Upload A Recipe!</h1>
            <form onSubmit={uploadRecipe}>
                <div>
                    <input
                        type="text"
                        id="recipeName"
                        name="recipeName"
                        onChange={handleChange}
                        placeholder="Add Recipe Name..."
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        id="ingredientQuantity"
                        name="ingredientQuantity"
                        placeholder="Add Quantity..."
                        ref={ingQuant}

                    />
                    <input
                        type="text"
                        id="ingredientLines"
                        name="ingredientLines"
                        placeholder="Add Ingredient..."
                        ref={ingRef}

                    />
                    <button
                        onClick={(event) => addIng(event, "ingredientLines")}
                    >
                        Add
                    </button>
                </div>
                
                <div>
                    <input
                        type="number"
                        step={1}
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
                        id="calories"
                        name="calories"
                        onChange={handleChange}
                        placeholder="Add Calories..."
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        id="cuisine"
                        name="cuisine"
                        onChange={handleChange}
                        placeholder="Add Cuisine..."
                        required
                    />
                </div>
                <div>
                    <textarea 
                    name="directions" 
                    id="directions" 
                    cols="30" 
                    rows="10"
                    placeholder="Recipe Directions..."
                    ref={directionsRef}
                    >

                    </textarea>
                    <button
                        onClick={(event) => addDirections(event, "directions")}
                    >
                        Add
                    </button>
                </div>
                <button type="submit">Upload Recipe</button>
            </form>
        <div>
            <h1>Your recipe</h1>
            <h2>{recipe.recipeName}</h2>
            <h3>{recipe.recipeSource}</h3>
            <h4>Ingredients</h4>
            {
                recipe.ingredientLines.map((ingredient) => (
                    <div>
                    <p>{ingredient.text}</p> <button onClick={(event) => removeIng(event, ingredient)}>x</button>
                    </div>      
                ))
            }
            <h4>Servings: </h4> <p>{recipe.servings}</p>
            <h4>Calories: </h4> <p>{recipe.calories}</p>
            <h4>Cuisine: </h4> <p>{recipe.cuisine}</p>
            <h5>Directions</h5> <p>{recipe.directions}</p>
        </div>
        </div>
    );
}