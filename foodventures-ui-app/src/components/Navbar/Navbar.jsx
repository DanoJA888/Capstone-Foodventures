import React, {useContext} from "react"
import { UserContext } from '../UserContext';
import { Link, useNavigate} from 'react-router-dom';
import "./Navbar.css";
import ProfileOptions from "../User/ProfileOptions/ProfileOptions";

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
          <div>
            {currUser ? (
                <div className="d-flex align-items-center">
                  <Link to="/upload" className="btn btn-outline-light m-1">Upload a Recipe!</Link>
                  <ProfileOptions handleLogout={handleLogout}/>
                  </div>
              ):(
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