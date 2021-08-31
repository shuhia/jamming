import React from "react";
import "./Track.css";

function Track(props) {
  const { name, artist, album, previewUrl } = props.track;
  const isRemoval = props.isRemoval;
  const handleClick = isRemoval ? removeTrack : addTrack;
  function renderAction() {
    return (
      <button className="Track-action" onClick={handleClick}>
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
      <div className="Track" onClick={handleClick}>
        <div className="Track-information">
          <h3>{name}</h3>
          <p>
            {artist} | {album}
          </p>
        </div>

        {previewUrl && <audio src={previewUrl} controls></audio>}

        {renderAction()}
      </div>
    </>
  );
}

export default Track;
