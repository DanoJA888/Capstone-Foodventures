import React from "react";
import "./Search.css";
import SearchParams from "../SearchParams/SearchParams";

export default function Search({cuisineList, updateSearch, updateCuisine}) {
  return (
    <div>
        <h1 class= "text-center p-4">Search</h1>
        <div>
          <SearchParams cuisineList = {cuisineList} updateSearch = {updateSearch} updateCuisine = {updateCuisine}/>
        </div>
    </div>
  )
}