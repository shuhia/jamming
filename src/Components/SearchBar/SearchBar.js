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

  // Restore search term after redirect

  useEffect(() => {
    const term = window.localStorage.getItem("search-term");
    if (term) {
      setTerm(term);
    }
  }, []);

  //
  useEffect(() => {
    if (term) {
      window.localStorage.setItem("search-term", term);
    }
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
    </div>
  );
}

export default SearchBar;
