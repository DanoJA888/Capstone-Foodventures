import React, { useState, useContext } from "react";
import { UserContext } from "../UserContext.js";
import "./Home.css";
import axios from "axios";
import cuisines from "../../../constant.js";

export default function Home() {
  const { currUser, updateUser } = useContext(UserContext);
  console.log(cuisines);

  return (
    <div className="home">
      <p>Home</p>
      <div>{currUser && <p>Welcome {currUser.username}</p>}</div>

      <div>
        {Object.entries(cuisines).map(([key, value])=> (
          <div>
            <p>{key}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
