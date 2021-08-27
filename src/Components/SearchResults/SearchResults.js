import React from "react";
import TrackList from "../TrackList/TrackList";
import "./SearchResults.css";

function SearchResults(props) {
  return (
    <div className="SearchResults">
      <h2>Results</h2>
      <TrackList SearchResults={props.SearchResults}></TrackList>
    </div>
  );
}

export default SearchResults;
