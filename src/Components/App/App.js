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
        id: 1,
      },
      {
        name: "So Emotional",
        artist: "Whitney Houston",
        album: "Whitney",
        id: 2,
      },
      {
        name: "It's Not Right But It's Okay",
        artist: "Whitney Houston",
        album: "My Love Is Your Love",
        id: 3,
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
        id: 1,
      },
      {
        name: "So Emotional",
        artist: "Whitney Houston",
        album: "Whitney",
        id: 2,
      },
      {
        name: "It's Not Right But It's Okay",
        artist: "Whitney Houston",
        album: "My Love Is Your Love",
        id: 3,
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

  function removeTrack(id) {
    setPlayList((prev) => {
      return {
        ...prev,
        tracks: prev.tracks.filter((track) => track.id !== id),
      };
    });
  }

  function updatePlaylistName(name) {
    setPlayList((prev) => {
      return { ...prev, name };
    });
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
        <Playlist
          playlist={playlist}
          onRemove={removeTrack}
          onNameChange={updatePlaylistName}
        ></Playlist>
      </div>
    </div>
  );
}

export default App;
