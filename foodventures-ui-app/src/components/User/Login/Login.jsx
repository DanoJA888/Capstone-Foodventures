import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext.js';
import "./Login.css"


export default function LoginForm(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        const loggedInUser = data.user;
        updateUser(loggedInUser);
        navigate('/');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      alert('Login failed: ' + error);
    }
  };

  return (
    <div className ="container">
      <h2 className="title mb-4">Login</h2>
      <div className="container d-flex justify-content-center align-items-center">
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username:</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password:</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary">Login</button>
            <p className="mt-3">
              New to Foodventures? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}