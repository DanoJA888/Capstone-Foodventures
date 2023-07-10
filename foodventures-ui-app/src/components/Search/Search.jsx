import React, { useState, useContext } from "react";
import "./Search.css"
import { UserContext } from '../UserContext';

export default function Search({cuisine}) {
  const { currUser, updateUser } = useContext(UserContext);
  console.log(cuisine);
  return (
    <div>
        <p>Search</p>
    </div>
  )
}