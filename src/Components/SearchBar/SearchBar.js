import React from "react";
import "./SearchBar.css";

function SearchBar(props) {
  function search(term) {
    props.onSearch(term);
  }

  function handleTermChange(e) {
    const term = e.target.value;
    search(term);
  }
  return (
    <div className="SearchBar">
      <input
        placeholder="Enter A Song, Album, or Artist"
        onChange={handleTermChange}
      />
      <button className="SearchButton">SEARCH</button>
    </div>
  );
}

export default SearchBar;
