import React from "react";
import "../styles/Generate.css";
import AutoAwesome from "@mui/icons-material/AutoAwesome";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";

export default function Generate() {
  return (
    <div className="generateContainer">
      <div className="generateHeader">
        <AutoAwesome fontSize="large" />
        <h1>Generate Playlist</h1>
      </div>
      <div className="generateForm">
        <form>
          <label>
            Choose your vibe, tweak your preferences, and let Playlisty work its
            magic!
          </label>
          <textarea
            style={{ fontSize: "20px" }}
            placeholder="What’s Your Vibe Today? What’s the occasion?"
          ></textarea>
          <div className="preferences">
            <a>
              <p>Add Specific Songs</p>
              <AddBoxOutlinedIcon className="addSign" fontSize="large" />
            </a>
            <textarea
              style={{ fontSize: "20px" }}
              placeholder="Specify genres or other preferences.."
            ></textarea>
          </div>
          <input className="generateButton" type="button" value="Generate Now!"></input>
        </form>
      </div>
    </div>
  );
}
