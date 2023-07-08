import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createContext } from 'react';
import { UserContext } from '../../UserContext.js';


export default function LoginForm(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();
  return (
    <div>
      <form>
        <h2>Login</h2>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <p>
          New to Foodventures?? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};
