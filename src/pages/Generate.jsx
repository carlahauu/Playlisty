import React from "react";
import "../styles/Generate.css";
import { useState, useEffect } from "react";
import AutoAwesome from "@mui/icons-material/AutoAwesome";
import { GoogleGenerativeAI } from "@google/generative-ai";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import SpotifyWebApi from "spotify-web-api-js";
import axios from "axios";
import { Close } from "@mui/icons-material";
import GeneratedPlaylist from "./GeneratedPlaylist";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

export default function Generate() {
  const [preferences, setPreferences] = useState("");
  const [vibe, setVibe] = useState("");
  const trackUri = []

  const [generatedSongs, setGeneratedSongs] = useState([]);
  const [generated, setGenerated] = useState(false);

  const [artistSearchBox, setArtistSearchBox] = useState(false);
  const [songSearchBox, setSongSearchBox] = useState(false);

  const [searchKey, setSearchKey] = useState("");

  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [artistNames, setArtistNames] = useState([]);
  const [songNames, setSongNames] = useState([]);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function searchTracks(songs) {
    let token = window.localStorage.getItem("token");
    const spotifyApi = new SpotifyWebApi();
  
    spotifyApi.setAccessToken(token);
  
    for (const song of songs) {
      const searchResult = await spotifyApi.searchTracks(`${song.song} by ${song.artist}`);
  
      if (searchResult.tracks.items.length > 0) {
        trackUri.push(searchResult.tracks.items[0].uri);
        console.log(trackUri)
      } else {
        console.log(`Unable to find track: ${song.name}`);
      }
    }
    createPlaylist(trackUri, vibe)
    return trackUri;
  }

  async function createPlaylist(trackUris, playlistName) {
    const spotifyApi = new SpotifyWebApi();
    const user = await spotifyApi.getMe();
    const userId = user.id;
    let token = window.localStorage.getItem("token");
  
    // Assuming you have a valid Spotify access token
    spotifyApi.setAccessToken(token);
  
    const playlistData = {
      name: playlistName,
      public: true,
    };

    const playlistUris = {
      "uris": trackUris
    }
  
    const createdPlaylist = await spotifyApi.createPlaylist(userId, playlistData);
  
    await spotifyApi.addTracksToPlaylist(createdPlaylist.id, trackUris);
  
    return createdPlaylist;
  }

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

  const searchSongs = async (e) => {
    let token = window.localStorage.getItem("token");
    e.preventDefault();
    try {
      const { data } = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: searchKey,
          type: "track",
        },
      });
      setSongs(data.tracks.items);
      console.log(songs)
    } catch (error) {
      console.log(error.message);
      setError(true);
    }
  };

  const appendSongs = (songName, songArtist, songImg) => {
    setSongSearchBox(false);
    setSongNames((prevSongNames) => [
      { name: songName, artist: songArtist, image: songImg },
      ...prevSongNames,
    ]);
  };

  const deleteSongs = (songToDelete, artistToDelete, imageToDelete) => {
    setSongNames((prevSongNames) =>
      prevSongNames.filter(
        (songs) =>
          songs.name !== songToDelete ||
          songs.artist !== artistToDelete ||
          songs.image !== imageToDelete
      )
    );
  };

  const appendArtists = (artistName, artistImg) => {
    setArtistSearchBox(false);
    setArtistNames((prevArtistNames) => [
      { name: artistName, image: artistImg },
      ...prevArtistNames,
    ]);
  };

  const deleteArtist = (nameToDelete, imageToDelete) => {
    setArtistNames((prevArtistNames) =>
      prevArtistNames.filter(
        (artistName) =>
          artistName.name !== nameToDelete || artistName.image !== imageToDelete
      )
    );
  };

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  async function generate() {
    setLoading(true);

    const prompt = `
  Generate a playlist of songs based on the user’s input. 
  The user is looking for this vibe: ${vibe}, which reflects the overall mood they want. 
  The user also has these preferences: ${preferences}, which includes specified genres. 
  
  You must **always include these specific songs**: ${songNames
    .map((song) => `"${song.name}" by ${song.artist}`)
    .join(", ")}.
    
  You must include **multiple songs from each of these artists**: ${artistNames
    .map((artist) => artist.name)
    .join(", ")}, with a minimum of 3-5 songs per artist.
  
  To complete the playlist, please add songs from other similar artists in the same genre that fit the user’s vibe, preferences, and specified songs and artists. 

  The playlist should align with the overall mood and preferences, and it must contain at least 20 songs in total.
  
  Please return the playlist as a JSON object called 'playlist'. Each entry should contain both the song name and the artist name. Make sure to include all specified songs and artists, and ensure their presence dominates the playlist.
  Please don't include the backticks and json text in the beginning, and the 3 backticks in the end.
  `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;

      const text = await response.text();

      const parsed = JSON.parse(text);

      setGeneratedSongs(parsed.playlist);
      setLoading(true);
      console.log("Songs: ", parsed.playlist);
      if (loading == false) {
        setGenerated(true);
      } else {
        setGenerated(false);
      }
      searchTracks(parsed.playlist)

    } catch (error) {
      console.log(generatedSongs);
      console.error("Error generating playlist:", error);
    } finally {
      setLoading(false);
    }
  }

  async function oldGenerate() {
    setLoading(true);
    const prompt = `
  Generate a playlist of songs based on the user’s input. 
  The user is looking for this vibe: ${vibe}, which reflects the overall mood they want. 
  The user also has these preferences: ${preferences}, which includes specified genres. 
  
  You must **always include these specific songs**: ${songNames
    .map((song) => `"${song.name}" by ${song.artist}`)
    .join(", ")}.
    
  You must include **multiple songs from each of these artists**: ${artistNames
    .map((artist) => artist.name)
    .join(", ")}, with a minimum of 3-5 songs per artist.
  
  To complete the playlist, please add songs from other similar artists in the same genre that fit the user’s vibe, preferences, and specified songs and artists. 

  The playlist should align with the overall mood and preferences, and it must contain at least 20 songs in total.
  
  Please return the playlist as a JSON object called 'playlist'. Each entry should contain both the song name and the artist name. Make sure to include all specified songs and artists, and ensure their presence dominates the playlist.
  Please don't include the backticks and json text in the beginning, and the 3 backticks in the end.
  `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(JSON.parse(text));
    setGeneratedSongs(JSON.parse(text));
    setLoading(false);
    console.log(generatedSongs);
  }

  return (
    <>
      {generated == false ? (
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
                  <div
                    onClick={() => setArtistSearchBox(false)}
                    className="closeBtn"
                  >
                    <Close fontSize="small" />
                  </div>
                </form>
                <div className="results">
                  {artists.map((artist) => (
                    <div
                      onClick={() =>
                        appendArtists(artist.name, artist.images[0].url)
                      }
                      className="result"
                      key={artist.id}
                    >
                      {artist.images.length ? (
                        <img src={artist.images[0].url} alt="" />
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
          {songSearchBox ? (
            <div className="artistSearchContainer">
              <div className="artistSearchBox">
                <form onSubmit={searchSongs}>
                  <input
                    type="text"
                    onChange={(e) => setSearchKey(e.target.value)}
                  />
                  <button type={"submit"}>Search</button>
                  <div
                    onClick={() => setSongSearchBox(false)}
                    className="closeBtn"
                  >
                    <Close fontSize="small" />
                  </div>
                </form>
                <div className="results">
                  {songs.map((song) => (
                    <div
                      onClick={() =>
                        appendSongs(
                          song.name,
                          song.album.artists[0].name,
                          song.album.images[0].url
                        )
                      }
                      className="songResult"
                      key={song.id}
                    >
                      <img src={song.album.images[0].url} />
                      <div className="songDetails">
                        <p className="songName">{song.name}</p>
                        <p className="songArtist">
                          {song.album.artists[0].name}
                        </p>
                      </div>
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
                Choose your vibe, tweak your preferences, and let Playlisty work
                its magic!
              </label>
              <textarea
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                style={{ fontSize: "20px" }}
                placeholder="What’s Your Vibe Today? What’s the occasion?"
              ></textarea>
              <div className="preferences">
                <a onClick={() => setSongSearchBox(true)}>
                  <p>Add Specific Songs</p>
                  <AddBoxOutlinedIcon className="addSign" fontSize="medium" />
                </a>
                <a onClick={() => setArtistSearchBox(true)}>
                  <p>Add Specific Artists</p>
                  <AddBoxOutlinedIcon className="addSign" fontSize="medium" />
                </a>
                <textarea
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  style={{ fontSize: "20px" }}
                  placeholder="Specify genres or other preferences.."
                ></textarea>
              </div>
              <div className="preferredArtists">
                {songNames.map((songName, key) => (
                  <>
                    <div key={key} className="preferredSong">
                      <img src={songName.image} />
                      <div className="preferredSongDetails">
                        <p className="preferredSongName">{songName.name}</p>
                        <p className="preferredSongArtist">{songName.artist}</p>
                      </div>
                      <div
                        onClick={() =>
                          deleteSongs(
                            songName.name,
                            songName.artist,
                            songName.image
                          )
                        }
                        className="deleteArtistPreference"
                      >
                        <Close />
                      </div>
                    </div>
                  </>
                ))}
              </div>
              <div className="preferredArtists">
                {artistNames.map((artistName, key) => (
                  <>
                    <div key={key} className="preferredArtist">
                      <img src={artistName.image} />
                      <p>{artistName.name}</p>
                      <div
                        onClick={() =>
                          deleteArtist(artistName.name, artistName.image)
                        }
                        className="deleteArtistPreference"
                      >
                        <Close />
                      </div>
                    </div>
                  </>
                ))}
              </div>
              <input
                onClick={generate}
                className="generateButton"
                type="button"
                value="Generate Now!"
              ></input>
            </form>
            {loading == true ? (
              <div className="loadingMsg">
                <HourglassEmptyIcon fontSize="large" />
                <p>Generating Now! This might take a minute.</p>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        <>
          <GeneratedPlaylist name={vibe} songs={generatedSongs} />
        </>
      )}
    </>
  );
}
