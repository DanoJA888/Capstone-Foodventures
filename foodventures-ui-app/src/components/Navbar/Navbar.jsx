import * as React from "react"
import "./Navbar.css"

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-links">
          <a href="/">Home</a>
          <a href="/search">Search</a> 
          <a href="/mealplan">Meal Plan</a>
          <a href="/login">Login</a>
          <a href="/signup">Signup</a>
        </div>
      </div>
    </nav>
  )
}
