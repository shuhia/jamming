import "./App.css";
import { useState, useEffect } from "react";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import SearchBar from "../SearchBar/SearchBar";
import { Spotify } from "../../util/Spotify";

// TODOS
// ADD users playlist

function App(props) {
  const [isSaving, setIsSaving] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [spotifyToken, setSpotifyToken] = useState(null);

  const [playlist, setPlayList] = useState({
    name: "New Playlist",
    tracks: [],
  });

  const filteredSearchResults = searchResults.filter(
    (result) => !playlist.tracks.some((track) => track.id === result.id)
  );

  useEffect(() => {
    // Restore search results
    const resultData = window.sessionStorage.getItem("searchResults");
    const result = JSON.parse(resultData);
    if (result) {
      setSearchResults(result);
    }
  }, []);

  useEffect(() => {
    // Search if user returned from spotify auth page and has a search term
    const searchTerm = window.sessionStorage.getItem("search-term");
    const executeSearch = window.sessionStorage.getItem("search");
    if (executeSearch === "true" || searchTerm) {
      searchTerm(searchTerm);
    }
  }, []);

  useEffect(() => {
    // Save current searchResults
    if (searchResults) {
      window.sessionStorage.setItem(
        "searchResults",
        JSON.stringify(searchResults)
      );
    }
  }, [searchResults]);

  // Add track
  function addTrack(track) {
    if (!playlist.tracks.some((e) => e.id === track.id)) {
      setPlayList((playlist) => {
        return { ...playlist, tracks: [track, ...playlist.tracks] };
      });
    }
  }
  // Remove track from
  function removeTrackFromPlaylist(id) {
    setPlayList((prev) => {
      return {
        ...prev,
        tracks: prev.tracks.filter((track) => track.id !== id),
      };
    });
  }

  function setPlaylistName(name) {
    setPlayList((prev) => {
      return { ...prev, name };
    });
  }

  function savePlaylistToSpotify() {
    setIsSaving(true);
    const trackURIs = playlist.tracks.map((track) => track.uri);
    // TODO UPDATE PLAYLIST

    Spotify.savePlaylist(playlist.name, trackURIs)
      .then(resetPlaylist())
      .then(setIsSaving(false));
  }

  function resetPlaylist() {
    // TODOS
    // Set playlist name to new playlist
    setPlayList({ name: "", tracks: [] });
    // Set playlistTracks to an empty array
  }

  function resetSearchResults() {
    setSearchResults([]);
  }

  function searchTrack(term) {
    window.sessionStorage.setItem("search", "true");
    Spotify.search(term).then((results) => {
      const filteredResults = results.filter(
        (track) =>
          !playlist.tracks.some(
            (playListTrack) => track.id === playListTrack.id
          )
      );
      setSearchResults(filteredResults);
    });
    window.sessionStorage.setItem("search", "false");
  }

  return (
    <div>
      <header>
        <div className="UserTitle">
          <a href="#">
            <h1>
              Ja<span className="highlight">mmm</span>ing
            </h1>
          </a>
          <SearchBar
            onSearch={searchTrack}
            onReset={resetSearchResults}
          ></SearchBar>
        </div>
      </header>

      <div className="App">
        <div className="App-playlist">
          <SearchResults
            searchResults={filteredSearchResults}
            onAdd={addTrack}
          ></SearchResults>
          <Playlist
            playlist={playlist}
            onRemove={removeTrackFromPlaylist}
            onNameChange={setPlaylistName}
            onSave={savePlaylistToSpotify}
            isSaving={isSaving}
          ></Playlist>
        </div>
      </div>
    </div>
  );
}

export default App;
