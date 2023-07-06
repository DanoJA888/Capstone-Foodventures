import React, { useState } from "react";
import "./Home.css";
import axios from "axios";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [showUser, setShowUser] = useState(false);
  const fetchUser = async () => {
    const response = await fetch('http://localhost:3001/user');
    const data = await response.json();
    setUsers(data);
  };
  const clickShow = async () =>{
    if(!showUser){
      fetchUser();
      setShowUser(!showUser);
    }
    else{
      setUsers(false);
      setShowUser(!showUser);
    }
  }
  return (
    <div className="home">
      <p>Home</p>
      
      <button onClick={() => clickShow()}>Testing connection</button>
      <div>
        {showUser &&
          <div>
            {users && users.map((user) => (
              <div className="user" key={user.password} >
                <p>{user.username}</p>
                <p>{user.email}</p>
                <p>{user.password}</p>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  )
}
