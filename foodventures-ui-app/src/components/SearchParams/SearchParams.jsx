import React , {  useState } from "react"
import "./SearchParams.css";
import { useNavigate } from 'react-router-dom';

export default function SearchParams({updateSearch}){
    const navigate = useNavigate();
    const [currentSearchField, updateSearchField] = useState("");
    function enterSearch(){
        updateSearch(currentSearchField);
    }
    return(
        <div className="search">
            <div className="search-content">
                <div className="search-section">
                    <form onSubmit={(event) => {event.preventDefault(); enterSearch(); navigate('/search_results') }}>
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