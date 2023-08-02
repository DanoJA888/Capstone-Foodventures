import React , { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { UserContext } from '../UserContext';
import Navbar from "../Navbar/Navbar";
import Home from "../Home/Home";
import Search from "../Search/Search";
import "./App.css";
import Login from "../User/Login/Login";
import Signup from "../User/Signup/Signup";
import RecipeInfo from "../RecipeInfo/RecipeInfo";
import SearchResults from "../SearchResults/SearchResults";
import Profile from "../User/Profile/Profile";
import UploadRecipe from "../User/UploadRecipe/UploadRecipe";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchCuisines } from "../../../constant.js";

export default function App() {
  const [currUser, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [cuisineList, setCuisineList] = useState([]);
  const [selectedCuisine, updateCuisine] = useState(null);
  const [currSearch, updateSearch] = useState(null);
  const updateUser = (newUser) => {
    setUser(newUser);
  };

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currUser));
  }, [currUser]);
  const getCuisines = async () => {
    const data = await fetchCuisines();
    setCuisineList(data);
  };

  useEffect(() => {
    getCuisines();
  }, []);

  return (
    <div className="app">
      <UserContext.Provider value={{ currUser, updateUser }}>
      <BrowserRouter>
        <main>
          <Navbar resetCuisine = {updateCuisine} resetSearch = {updateSearch}/>
          <Routes>
            <Route path = '/' element={<Home cuisineList  = {cuisineList} setCuisineList = {setCuisineList} updateCuisine = {updateCuisine}/>}></Route>
            <Route path = '/search' element={<Search cuisineList  = {cuisineList} updateSearch  = {updateSearch} updateCuisine = {updateCuisine}/>}></Route>
            <Route path = '/search_results' element={<SearchResults cuisineList  = {cuisineList} cuisine = {selectedCuisine} search = {currSearch} updateSearch = {updateSearch} updateCuisine = {updateCuisine}/>}></Route>
            <Route path = '/searched/:recipeId' element={<RecipeInfo/>}></Route>
            <Route path = '/login' element={<Login/>}></Route>
            <Route path = '/signup' element={<Signup/>}></Route>
            <Route path = '/profile' element = {<Profile/>}></Route>
            <Route path = '/upload' element = {<UploadRecipe cuisineList={cuisineList}/>}></Route>
          </Routes>
          
        </main>
      </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}
