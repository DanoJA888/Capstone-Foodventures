import React , { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Navbar from "../Navbar/Navbar"
import Sidebar from "../Sidebar/Sidebar"
import Home from "../Home/Home"
import Search from "../Search/Search"
import "./App.css"
import MealPlan from "../MealPlan/MealPlan"
import Login from "../User/Login/Login"
import Signup from "../User/Signup/Signup"

export default function App() {
  return (
    <div className="app">
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
    </div>
  )
}
