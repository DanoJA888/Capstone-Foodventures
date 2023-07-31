import React, { useEffect, useState, useContext } from "react";
import "./Search.css";
import SearchParams from "../SearchParams/SearchParams";

export default function Search({cuisineList, updateSearch, updateCuisine}) {
  return (
    <div>
        <h1 className="title">Search</h1>
        <div>
          <SearchParams cuisineList = {cuisineList} updateSearch = {updateSearch} updateCuisine = {updateCuisine}/>
        </div>
    </div>
  )
}