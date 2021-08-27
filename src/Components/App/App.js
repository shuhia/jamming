import "./App.css";
import { useState } from "react";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";

function App(props) {
  const [searchResults, setSearchResults] = useState({});
  const [playlist, setPlayList] = useState({
    listName: "New Playlist",
    listTracks: [],
  });
  return (
    <div>
      <h1>
        Ja<span className="highlight">mmm</span>ing
      </h1>
      <div className="App">
        SearchBar
        <div className="App-playlist"></div>
        <SearchResults searchResults={searchResults}></SearchResults>
        <Playlist playlist={playlist}></Playlist>
      </div>
    </div>
  );
}

export default App;
