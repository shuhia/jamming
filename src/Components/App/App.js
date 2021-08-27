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

  function addTrack(track) {
    if (!playlist.listTracks.includes((e) => e.id === track.id)) {
      setPlayList((prev) => {
        return { ...prev, listTracks: [...prev.listTracks, track] };
      });
    }
  }

  return (
    <div>
      <h1>
        Ja<span className="highlight">mmm</span>ing
      </h1>
      <div className="App">
        SearchBar
        <div className="App-playlist"></div>
        <SearchResults
          searchResults={searchResults}
          onAdd={addTrack}
        ></SearchResults>
        <Playlist playlist={playlist}></Playlist>
      </div>
    </div>
  );
}

export default App;
