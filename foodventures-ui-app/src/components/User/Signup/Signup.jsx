import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext.js";
import axios from "axios";
import "./Signup.css"

export default function Signup() {
  const [currInfo, setInfo] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    heightFt: 0,
    heightIn: 0,
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
      const response = await axios.post("http://localhost:3001/user/signup", currInfo, { withCredentials: true });

      setInfo({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        heightFt: 0,
        heightIn: 0,
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

  return (
    <div className="container">
      <h2 className="text-center my-3">Sign Up</h2>
      <div className="container d-flex justify-content-center align-items-center">
        <form className="mt-4" onSubmit={uploadNewUser}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="heightFt" className="form-label">Height(ft):</label>
            <input
              type="number"
              step={1}
              id="heightFt"
              name="heightFt"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="heightIn" className="form-label">Height(in):</label>
            <input
              type="number"
              step={1}
              id="heightIn"
              name="heightIn"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="weight" className="form-label">Weight(lbs):</label>
            <input
              type="number"
              step={1}
              id="weight"
              name="weight"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary">Sign Up</button>
            <p className="mt-3">
              Already have an account?
              <Link to="/login">Log In</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}