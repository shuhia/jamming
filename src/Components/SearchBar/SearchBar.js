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
    const term = window.sessionStorage.getItem("search-term");
    if (term) {
      setTerm(term);
    }
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem("search-term", term);
  }, [term]);

  return (
    <div className="SearchBar">
      <input
        placeholder="Enter A Song, Album, or Artist"
        onChange={handleTermChange}
        value={term}
      />

      <button className="SearchButton" onClick={search}>
        SEARCH
      </button>
      <button className="ResetButton" onClick={handleReset}>
        RESET
      </button>
    </div>
  );
}

export default SearchBar;
