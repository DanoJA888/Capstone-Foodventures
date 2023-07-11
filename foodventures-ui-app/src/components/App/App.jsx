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
import RecipeInfo from "../RecipeInfo/RecipeInfo";

export default function App() {
  const [currUser, setUser] = useState(() => {
    const storedUser = localStorage.getItem('currUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [selectedCuisine, updateCuisine] = useState("");
  console.log(currUser)
  const updateUser = (newUser) => {
    setUser(newUser);
  };

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currUser));
  }, [currUser]);

  return (
    <div className="app">
      <UserContext.Provider value={{ currUser, updateUser }}>
      <BrowserRouter>
        <main>
          <Navbar />
          <Routes>
            <Route path = '/' element={<Home chooseCuisine = {updateCuisine}/>}></Route>
            <Route path = '/search' element={<Search cuisine = {selectedCuisine}/>}></Route>
            <Route path = '/search/:recipeId' element={<RecipeInfo/>}></Route>
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
