import React, { useState, useEffect } from "react";
import "./SearchBar.css";

function SearchBar(props) {
  const [term, setTerm] = useState("");
  function search() {
    props.onSearch(term);
  }
  function handleTermChange(e) {
    setTerm(e.target.value);
  }

  function handleReset(e) {
    props.onReset();
    setTerm("");
  }

  // Restore search term after redirect

  useEffect(() => {
    const term = window.localStorage.getItem("search-term");
    if (term) {
      setTerm(term);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("search-term", term);
  }, [term]);

  return (
    <div className="SearchBar">
      <input
        placeholder="Enter A Song, Album, or Artist"
        onChange={handleTermChange}
        value={term}
      />
      <div>
        <button className="SearchButton" onClick={search}>
          SEARCH
        </button>
        <button className="resetButton" onClick={handleReset}>
          RESET
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
