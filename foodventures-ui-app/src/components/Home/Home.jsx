import React, { useState, useContext } from "react";
import { UserContext } from "../UserContext.js";
import "./Home.css";
import axios from "axios";
import * as constants from "../../../constant.js"

export default function Home() {
  const { currUser, updateUser } = useContext(UserContext);

  return (
    <div className="home">
      <p>Home</p>
      <div>
        {currUser &&
          <p>Welcome {currUser.username}</p>
        }
      </div>
    </div>
  );
}
