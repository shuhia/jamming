import "./App.css";
import { useState } from "react";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import SearchBar from "../SearchBar/SearchBar";
import { Spotify } from "../../util/Spotify";

// TODOS
// ADD users playlist

function App(props) {
  const [searchResults, setSearchResults] = useState([]);
  const [playlist, setPlayList] = useState({
    name: "New Playlist",
    tracks: [],
  });

  function addTrack(track) {
    if (!playlist.tracks.some((e) => e.id === track.id)) {
      setPlayList((playlist) => {
        return { ...playlist, tracks: [track, ...playlist.tracks] };
      });
      // Remove track from searchResults
      setSearchResults((prev) =>
        prev.filter((prevTrack) => prevTrack.id !== track.id)
      );
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

  function savePlaylist() {
    const trackURIs = playlist.tracks.map((track) => track.uri);

    // TODO UPDATE PLAYLIST
    Spotify.savePlaylist(playlist.name, trackURIs).then(createNewPlaylist());
  }

  function createNewPlaylist() {
    // TODOS
    // Set playlist name to new playlist
    setPlayList({ name: "", tracks: [] });
    // Set playlistTracks to an empty array
  }

  function search(term) {
    Spotify.search(term).then((results) => {
      const filteredResults = results.filter(
        (track) =>
          !playlist.tracks.some(
            (playListTrack) => track.id === playListTrack.id
          )
      );
      setSearchResults(filteredResults);
    });
  }

  return (
    <div>
      <h1>
        Ja<span className="highlight">mmm</span>ing
      </h1>
      <div className="App">
        <SearchBar onSearch={search}></SearchBar>
        <div className="App-playlist">
          <SearchResults
            searchResults={searchResults}
            onAdd={addTrack}
          ></SearchResults>
          <Playlist
            playlist={playlist}
            onRemove={removeTrack}
            onNameChange={updatePlaylistName}
            onSave={savePlaylist}
          ></Playlist>
        </div>
      </div>
    </div>
  );
}

export default App;
