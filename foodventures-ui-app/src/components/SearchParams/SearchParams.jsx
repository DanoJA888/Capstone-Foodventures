import * as React from "react"
import "./SearchParams.css";
import { useNavigate } from 'react-router-dom';

export default function SearchParams({currSearch, setSearch}){

    const navigate = useNavigate();
    return(
        <div className="search">
            <div className="search-content">
                <div className="search-section">
                    <input
                        id = "inputField"
                        type="text"
                        value = {currSearch}
                        onChange={(e) => {setSearch(e.target.value)}}
                    ></input>
                    <button onClick={() => {navigate('/search_results')}}>Search</button>
                </div>
            </div>
        </div>
    )
}