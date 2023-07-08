import React , { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route} from 'react-router-dom'

import { UserContext } from '../UserContext';
import Navbar from "../Navbar/Navbar"
import Sidebar from "../Sidebar/Sidebar"
import Home from "../Home/Home"
import Search from "../Search/Search"
import "./App.css"
import MealPlan from "../MealPlan/MealPlan"
import Login from "../User/Login/Login"
import Signup from "../User/Signup/Signup"

export default function App() {
  const [currUser, setUser] = useState(() => {
    // Retrieve the user data from storage or set it to null if not found
    const storedUser = localStorage.getItem('currUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  useEffect(() => {
    // Save the user data to storage whenever the user state changes
    localStorage.setItem('user', JSON.stringify(currUser));
  }, [currUser]);

  return (
    <div className="app">
      <UserContext.Provider value={{ currUser, updateUser }}>
      <BrowserRouter>
        <main>
          <Navbar />
          <Routes>
            <Route path = '/' element={<Home/>}></Route>
            <Route path = '/search' element={<Search/>}></Route>
            <Route path = '/mealplan' element={<MealPlan/>}></Route>
            <Route path = '/login' element={<Login/>}></Route>
            <Route path = '/signup' element={<Signup/>}></Route>
          </Routes>
          
        </main>
      </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}
