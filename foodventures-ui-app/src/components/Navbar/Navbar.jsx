import React, {useState, useContext} from "react"
import { UserContext } from '../UserContext';
import { Link } from 'react-router-dom';
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
          <Link to="/">Home</Link>
          <Link to="/search">Search</Link>
          <Link to="/mealplan">Meal Plan</Link>
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
