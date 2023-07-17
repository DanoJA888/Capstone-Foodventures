import React, {useState, useContext} from "react"
import { UserContext } from '../UserContext';
import { Link, useNavigate} from 'react-router-dom';
import "./Navbar.css"

export default function Navbar({resetCuisine, resetSearch}) {
  const { currUser, updateUser } = useContext(UserContext);

  const navigate = useNavigate();
  const handleLogout = () =>{
    updateUser(null);
    navigate('/');
    console.log(currUser);
  }
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-links">
          <Link to="/" onClick={() => {resetSearch(""); resetCuisine("")}}>Home</Link>
          <Link to="/search">Search</Link>
          <Link to="/mealplan" onClick={() => {resetSearch(""); resetCuisine("")}}>Meal Plan</Link>
          <div>
            {
              currUser ? (
                <div>
                  <button onClick={()=> {handleLogout()}}>Logout</button>
                  <Link to="/profile">Profile</Link>
                </div>
            ) : (
                <div className="navbar-links">
                  <a href="/login" onClick={() => {resetSearch(""); resetCuisine("")}}>Login</a>
                  <a href="/signup" onClick={() => {resetSearch(""); resetCuisine("")}}>Signup</a>
                </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}