import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext.js";

export default function Signup() {
  const [currInfo, setInfo] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setInfo({
      ...currForm,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div>
      <form >
        <h2>Sign Up</h2>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
        <p>
          Already have an account?
          <Link to="/login">Log In</Link>
        </p>
      </form>
    </div>
  );
}
