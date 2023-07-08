import React, { useState, useContext } from "react";
import { UserContext } from "../UserContext.js";
import "./Home.css";
import axios from "axios";

export default function Home() {
  const { curUser, updateUser } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [showUser, setShowUser] = useState(false);
  const [currForm, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const fetchUser = async () => {
    const response = await fetch("http://localhost:3001/user");
    const data = await response.json();
    setUsers(data);
  };

  const clickShow = async () => {
    if (!showUser) {
      fetchUser();
      setShowUser(!showUser);
    } else {
      setUsers(false);
      setShowUser(!showUser);
    }
  };

  const handleChange = (event) => {
    setForm({
      ...currForm,
      [event.target.name]: event.target.value,
    });
  };

  const uploadNewUser = async () => {
    axios.post("http://localhost:3001/user", currForm);
  };

  return (
    <div className="home">
      <p>Home</p>
      <div>
        <button onClick={() => clickShow()}>Testing connection</button>
        <div>
          {" "}
          {showUser && (
            <div>
              {" "}
              {users &&
                users.map((user) => (
                  <div className="user" key={user.password}>
                    <p> {user.username}</p>
                    <p> {user.email}</p>
                    <p> {user.password}</p>
                  </div>
                ))}{" "}
            </div>
          )}{" "}
        </div>
      </div>
      <div>
        <form action="POST">
          <input
            type="text"
            name="username"
            id="unId"
            placeholder="Username"
            onChange={handleChange}
          />
          <input
            type="text"
            name="email"
            id="emailId"
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            type="text"
            name="password"
            id="pwId"
            placeholder="Password"
            onChange={handleChange}
          />
          <button onClick={() => uploadNewUser()}>Create Account</button>
        </form>
      </div>
    </div>
  );
}
