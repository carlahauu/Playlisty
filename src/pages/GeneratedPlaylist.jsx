import React from "react";
import "../styles/GeneratedPlaylist.css";
import { FaSpotify } from "react-icons/fa";

export default function GeneratedPlaylist(props) {
  return (
    <div className="generatedContainer">
      <div className="generatedHeader">
        <h1>{props.name}</h1>
        <p>
          Enjoying your personalized playlist? Give us your feedback{" "}
          <a href="https://forms.gle/iK1ameBZjRbYFyao7">here!</a>
        </p>
      </div>
      <div className="openPlaylistBtn">
        <a href="">
          <FaSpotify className="spotifyLogo" />
          <p>Open on Spotify!</p>
        </a>
      </div>
      <div className="generatedResults">
        {props.songs.map((data, key) => (
          <div className="generatedSongs" key={key}>
            <div className="generatedSongKey">{key + 1}</div>
            <div className="generatedSongDetails">
              <p className="generatedSongName">{data.song}</p>
              <p className="generatedSongArtist">{data.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
