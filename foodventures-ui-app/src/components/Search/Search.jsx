import React, { useEffect, useState, useContext } from "react";
import "./Search.css"
import { UserContext } from '../UserContext';
import {API_ID, API_KEY} from "../../../constant.js";
import { Link } from 'react-router-dom';
import RecipeInfo from "../RecipeInfo/RecipeInfo";
import SearchParams from "../SearchParams/SearchParams";

export default function Search({updateSearch}) {
  return (
    <div>
        <h1>Search</h1>
        <div>
          <SearchParams updateSearch={updateSearch}/>
        </div>
    </div>
  )
}