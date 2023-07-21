import React , {  useState } from "react"
import "./SearchParams.css";
import { useNavigate } from 'react-router-dom';

export default function SearchParams({updateSearch}){
    const navigate = useNavigate();
    const [currentSearchField, updateSearchField] = useState("");
    function enterSearch(event){
        event.preventDefault();
        updateSearch(currentSearchField);
        navigate('/search_results');
    }
    return(
        <div className="search">
            <div className="search-content">
                <div className="search-section">
                    <form onSubmit={(event) => enterSearch(event)}>
                        <input
                            id = "inputField"
                            type="text"
                            value = {currentSearchField}
                            onChange={(event) => {updateSearchField(event.target.value)}}
                        ></input>
                        <button type = "submit">Search</button>
                    </form>
                </div>
            </div>
        </div>
    )
}