import "./App.css";
import { useState } from "react";
import SearchResults from "../SearchResults/SearchResults";

function App(props) {
  const [searchResults, setSearchResults] = useState({});
  return (
    <div>
      <h1>
        Ja<span className="highlight">mmm</span>ing
      </h1>
      <div className="App">
        SearchBar
        <div className="App-playlist"></div>
        <SearchResults searchResults={searchResults}></SearchResults>, Playlist
      </div>
    </div>
  );
}

export default App;
