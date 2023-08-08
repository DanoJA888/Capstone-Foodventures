import React, {useContext} from "react";
import { UserContext } from "../../UserContext.js";
import './UserInfo.css'

export default function UserInfo() {
  const { currUser } = useContext(UserContext);
  return(
    <div class="container ">
      <h1 className="title">Your Profile Info</h1>
      <div class="row justify-content-center">
        <div class="col-md-6 info-box">
          <div class="col-md-3">
            <h1 className="fw-bold mb-0">{currUser.username}</h1> 
            <h3 className="mb-2">{currUser.firstName} {currUser.lastName}</h3>
            <h5> {currUser.email} </h5>
            <p className="mb-0">Height {currUser.heightFt}'{currUser.heightIn}</p>
            <p>Weight {currUser.weight} lbs</p>
          </div>
        </div>
      </div>
    </div>
  )
}