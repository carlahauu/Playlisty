import React from "react";
import "../styles/Generate.css";
import { useState, useEffect } from "react";
import AutoAwesome from "@mui/icons-material/AutoAwesome";
import { GoogleGenerativeAI } from "@google/generative-ai";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import SpotifyWebApi from "spotify-web-api-js";
import axios from "axios";
import { Close } from "@mui/icons-material";

export default function Generate() {
  const [preferences, setPreferences] = useState("");
  const [vibe, setVibe] = useState("");
  const [artistSearchBox, setArtistSearchBox] = useState(false);
  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState(false);

  const searchArtists = async (e) => {
    let token = window.localStorage.getItem("token");
    e.preventDefault();
    try {
      const { data } = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: searchKey,
          type: "artist",
        },
      });
      setArtists(data.artists.items);
    } catch (error) {
      console.log(error.message);
      setError(true);
    }
  };

  const geminiKey = import.meta.env.VITE_GEMINI_KEY;
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  async function generate() {
    console.log("loading");
    const prompt = `Generate a playlist of songs based on the user’s input. The user is looking for this vibe: ${vibe}, which reflects the overall mood they want. The user also has these preferences: ${preferences}, including specific genres, artists, or songs they like. The playlist should seamlessly align with both the desired vibe and preferences.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const parsedJSON = JSON.parse(text);
    setFlashCards(parsedJSON);
    setGenerated(!generated);
  }

  return (
    <div className="generateContainer">
      {error == true ? (
        <div className="error">
          <p>
            Log in expired! Please log in again at{" "}
            <a href="/">playlisty.carlahau.com</a>
          </p>
        </div>
      ) : (
        <></>
      )}
      {artistSearchBox ? (
        <div className="artistSearchContainer">
          <div className="artistSearchBox">
            <form onSubmit={searchArtists}>
              <input
                type="text"
                onChange={(e) => setSearchKey(e.target.value)}
              />
              <button type={"submit"}>Search</button>
              <div onClick={() => setArtistSearchBox(false)} className="closeBtn">
                <Close fontSize="small" />
              </div>
            </form>
            <div className="results">
              {artists.map((artist) => (
                <div className="result" key={artist.id}>
                  {artist.images.length ? (
                    <img width={"100px"} src={artist.images[0].url} alt="" />
                  ) : (
                    <div>No Image</div>
                  )}
                  <p>{artist.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
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
              <AddBoxOutlinedIcon className="addSign" fontSize="medium" />
            </a>
            <a onClick={() => setArtistSearchBox(true)}>
              <p>Add Specific Artists</p>
              <AddBoxOutlinedIcon className="addSign" fontSize="medium" />
            </a>
            <textarea
              style={{ fontSize: "20px" }}
              placeholder="Specify genres or other preferences.."
            ></textarea>
          </div>
          <input
            className="generateButton"
            type="button"
            value="Generate Now!"
          ></input>
        </form>
      </div>
    </div>
  );
}
