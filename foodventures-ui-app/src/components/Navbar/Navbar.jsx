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
    <nav className="navbar green-bg ">
      <div className="navbar-content">
        <div>
          <h1>Foodventures</h1>
        </div>
        <div className="d-flex align-items-center">
          <Link to="/" onClick={() => {resetSearch(null); resetCuisine(null)}} className="btn btn-outline-light m-1">Home</Link>
          <Link to="/search" className="btn btn-outline-light m-1">Search</Link>
          <Link to="/mealplan" onClick={() => {resetSearch(null); resetCuisine(null)}} className="btn btn-outline-light m-1" >Meal Plan</Link>
          <div>
            {
              currUser ? (
                <div className="d-flex align-items-center">
                  <Link to="/profile" className="btn btn-outline-light m-1">Profile</Link>
                  <Link to="/upload" className="btn btn-outline-light m-1">Upload a Recipe!</Link>
                  <button className="btn btn-danger text-light m-1" onClick={()=> {handleLogout()}}>Logout</button>
                </div>
            ) : (
                <div className="d-flex align-items-center">
                  <Link to="/login" className="btn btn-outline-light m-1">Login</Link>
                  <Link to="/signup" className="btn btn-outline-light m-1">Sign Up</Link>
                </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}