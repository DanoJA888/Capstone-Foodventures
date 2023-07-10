import React, {useState, useContext} from "react"
import { UserContext } from '../UserContext';
import "./Navbar.css"

export default function Navbar() {
  const { currUser, updateUser } = useContext(UserContext);
  const handleLogout = () =>{
    updateUser(null);
    console.log(currUser);
  }
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-links">
          <a href="/">Home</a>
          <a href="/search">Search</a> 
          <a href="/mealplan">Meal Plan</a>
          {!currUser &&
            <div className="navbar-links">
              <a href="/login">Login</a>
              <a href="/signup">Signup</a>
            </div>
          }
          {currUser &&
            <button onClick={()=> {handleLogout()}}>Logout</button>
          }
          
        </div>
      </div>
    </nav>
  )
}
