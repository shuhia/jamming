import "./App.css";
import { useState } from "react";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";

function App(props) {
  const [searchResults, setSearchResults] = useState({
    tracks: [
      {
        name: "Stronger",
        artist: "Britney Spears",
        album: "Ooops!... I Did It Again",
      },
      {
        name: "So Emotional",
        artist: "Whitney Houston",
        album: "Whitney",
      },
      {
        name: "It's Not Right But It's Okay",
        artist: "Whitney Houston",
        album: "My Love Is Your Love",
      },
    ],
  });
  const [playlist, setPlayList] = useState({
    name: "New Playlist",
    tracks: [
      {
        name: "Stronger",
        artist: "Britney Spears",
        album: "Ooops!... I Did It Again",
      },
      {
        name: "So Emotional",
        artist: "Whitney Houston",
        album: "Whitney",
      },
      {
        name: "It's Not Right But It's Okay",
        artist: "Whitney Houston",
        album: "My Love Is Your Love",
      },
    ],
  });

  function addTrack(track) {
    if (!playlist.tracks.includes((e) => e.id === track.id)) {
      setPlayList((prev) => {
        return { ...prev, tracks: [...prev.tracks, track] };
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
