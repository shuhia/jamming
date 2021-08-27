import React from "react";
import "./Track.css";

function Track(props) {
  const { name, artist, album } = props.track;
  function renderAction() {
    const action = props.isRemoval ? "-" : "+";
    return (
      <button className="Track-action" onClick={addTrack}>
        {action}
      </button>
    );
  }
  function addTrack() {
    props.onAdd(props.track);
  }
  return (
    <div className="Track">
      <div className="Track-information">
        <h3>{name}</h3>
        <p>
          {artist} | {album}
        </p>
      </div>
      {renderAction()}
    </div>
  );
}

export default Track;
