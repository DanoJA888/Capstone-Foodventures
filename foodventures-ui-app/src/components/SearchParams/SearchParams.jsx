import * as React from "react"
import "./SearchParams.css"

export default function SearchParams(){
    function handleSearch(){
        
    }
    return(
        <div className="search">
            <div className="search-content">
                <div className="search-section">
                    <input
                        id = "inputField"
                        type="text"
                    ></input>
                    <button>Search</button>
                </div>
            </div>
        </div>
    )
}