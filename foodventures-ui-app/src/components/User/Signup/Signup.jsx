import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext.js";
import axios from "axios";

export default function Signup() {
  const [currInfo, setInfo] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    height_ft: 0,
    height_in: 0,
    weight: 0,
  });


  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setInfo({
      ...currInfo,
      [event.target.name]: event.target.value,
    });
  };
  async function uploadNewUser(event) {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/user", currInfo, { withCredentials: true });

      setInfo({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        height_ft: 0,
        height_in: 0,
        weight: 0,
      });
    

      const user = response.data.user;
      updateUser(user);
      navigate("/");
      alert("Sign Up Successful.");
    } catch (error) {
      alert("Username or email already exists.");
    }
  }

  console.log(currInfo);

  return (
    <div>
      <form onSubmit={uploadNewUser}>
        <h2>Sign Up</h2>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="height_ft">Height(ft):</label>
          <input
          type="number"
          step={1}
          id="height_ft"
          name="height_ft"
          onChange={handleChange}
          required
          />
        </div>
        <div>
          <label htmlFor="height_in">Height(in):</label>
          <input
          type="number"
          step={1}
          id="height_in"
          name="height_in"
          onChange={handleChange}
          required
          />
        </div>
        <div>
          <label htmlFor="weight">Weight(lbs):</label>
          <input
          type="number"
          step={1}
          id="weight"
          name="weight"
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