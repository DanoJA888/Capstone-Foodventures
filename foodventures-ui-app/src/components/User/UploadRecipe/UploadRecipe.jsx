import React, {useContext, useState} from "react"
import { UserContext } from '../../UserContext.js';
import "./UploadRecipe.css"

export default function Navbar({resetCuisine, resetSearch}) {
  const { currUser, updateUser } = useContext(UserContext);
  const [currRecipe, setRecipe] = useState({
    recipeName: "",
    recipeSource: `Username: ${currUser}`,
    ingredientLines: [],
    directions: [],
    url: "",
    calories: 0,
    servings: 0,
    cuisine: "",
  });
  return (
    <h1>Upload A Recipe!</h1>
  )
}