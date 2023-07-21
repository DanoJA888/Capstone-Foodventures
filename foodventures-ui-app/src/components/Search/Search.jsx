import React, { useEffect, useState, useContext } from "react";
import "./Search.css";
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