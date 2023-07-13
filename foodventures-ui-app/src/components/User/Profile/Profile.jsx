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
            <p>USERNAME {currUser.username}</p>
            <p>EMAIL {currUser.email}</p>
            <p>NAME {currUser.first_name} {currUser.last_name}</p>
            <p>HEIGHT {currUser.height_ft}'{currUser.height_in}</p>
            <p>WEIGHT {currUser.weight} lbs</p>
          </div>
        )}
      </div>
    </div>
  );
}
