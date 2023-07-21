import React, {useContext} from "react"
import { UserContext } from '../UserContext';
import { Link, useNavigate} from 'react-router-dom';
import "./Navbar.css";

export default function Navbar({resetCuisine, resetSearch}) {
  const { currUser, updateUser } = useContext(UserContext);

  const navigate = useNavigate();
  const handleLogout = () =>{
    updateUser(null);
    navigate('/');
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
                <div className="navbar-links">
                  <Link to="/profile">Profile</Link>
                  <Link to="/upload">Upload a Recipe!</Link>
                  <button onClick={()=> {handleLogout()}}>Logout</button>
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