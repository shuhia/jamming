import React from "react";
import "./Playlist.css";
import TrackList from "../TrackList/TrackList";

function Playlist(props) {
  function handleNameChange(e) {
    const name = e.target.value;
    props.onNameChange(name);
  }
  return (
    <div className="Playlist">
      <input defaultValue={"New Playlist"} onChange={handleNameChange} />
      <TrackList
        tracks={props.playlist.tracks}
        onRemove={props.onRemove}
        isRemoval={true}
      ></TrackList>
      <button className="Playlist-save" onClick={props.onSave}>
        SAVE TO SPOTIFY
      </button>
    </div>
  );
}

export default Playlist;
