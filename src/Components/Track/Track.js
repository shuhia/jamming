import React from "react";
import "./Track.css";

function Track(props) {
  const { name, artist, album, previewUrl } = props.track;
  function renderAction() {
    const isRemoval = props.isRemoval;
    return (
      <button
        className="Track-action"
        onClick={isRemoval ? removeTrack : addTrack}
      >
        {isRemoval ? "-" : "+"}
      </button>
    );
  }

  function addTrack() {
    props.onAdd(props.track);
  }

  function removeTrack() {
    props.onRemove(props.track.id);
  }

  return (
    <>
      <div className="Track">
        <div className="Track-information">
          <h3>{name}</h3>
          <p>
            {artist} | {album}
          </p>
        </div>
        <div class="preview">
          {previewUrl && <audio src={previewUrl} controls></audio>}
        </div>
        {renderAction()}
      </div>
    </>
  );
}

export default Track;
