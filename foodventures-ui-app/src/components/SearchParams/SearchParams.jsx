import React , {  useState } from "react"
import "./SearchParams.css";
import { useNavigate } from 'react-router-dom';

export default function SearchParams({updateSearch}){
  const navigate = useNavigate();
  const [currentSearchField, updateSearchField] = useState("");
  function enterSearch(event){
    event.preventDefault();
    updateSearch(currentSearchField); 
    navigate('/search_results')
  }
  
  return (
    <div className="container mt-3">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <form onSubmit={enterSearch}>
            <div className="input-group">
            
              <input
                id="inputField"
                type="text"
                value={currentSearchField}
                onChange={(event) => { updateSearchField(event.target.value) }}
                className="form-control"
                placeholder="Search Recipes"
              />
              <div className="input-group-append">
                <button type="submit" className="btn btn-primary">Search</button>
              </div>
              
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}