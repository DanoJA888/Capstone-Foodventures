import React, { useContext } from "react";
import { UserContext } from "../../UserContext.js";
import "./Profile.css";

export default function Profile() {
  const { currUser, updateUser } = useContext(UserContext);
  return (
    <div>
      <p>Profile</p>
      <div>
        {currUser && (
          <div>
            <p>{currUser.username}</p>
            <p>{currUser.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}
