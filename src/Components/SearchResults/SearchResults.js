import React from "react";
import TrackList from "../TrackList/TrackList";
import "./SearchResults.css";

function SearchResults(props) {
  return (
    <div className="SearchResults">
      <h2>Results</h2>
      <TrackList
        SearchResults={props.SearchResults}
        onAdd={props.onAdd}
        isRemoval={false}
      ></TrackList>
    </div>
  );
}

export default SearchResults;
