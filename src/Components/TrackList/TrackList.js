import React from "react";
import "./TrackList.css";
import Track from "../Track/Track";

function TrackList({ tracks = [], ...rest }) {
  return (
    <div className="TrackList">
      {tracks &&
        tracks.map((track) => (
          <Track
            key={track.name}
            track={track}
            onAdd={rest.onAdd}
            onRemove={rest.onRemove}
            isRemoval={rest.isRemoval}
          ></Track>
        ))}
    </div>
  );
}

export default TrackList;
