import { QueueMusic } from "@mui/icons-material";
import React from "react";
import Navbar from "../components/Navbar";
import "../styles/Landing.css";
import { useEffect, useState } from "react";

export default function Landing() {
  const [token, setToken] = useState("");
  const REDIRECT_URI = "http://localhost:5173/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPE = [
    'playlist-modify-public',
    'playlist-modify-private',
    'user-library-read'
  ].join(' ');

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];
      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  return (
    <div className="landingContainer">
      <Navbar
        REDIRECT_URI={REDIRECT_URI}
        RESPONSE_TYPE={RESPONSE_TYPE}
        AUTH_ENDPOINT={AUTH_ENDPOINT}
        SCOPE={SCOPE}
        token={token}
        logout={logout}
      />
      <div className="landingContent">
        <div className="heroContainer">
          <div className="heroContent">
            <h1>
              <span>Playlisty</span> curates playlists that match your vibe in
              seconds!
            </h1>
            <p>
              Simply input your preferences, and let Playlisty do the rest,
              bringing you the best tracks tailored to your unique taste, all
              through seamless Spotify integration. It's your music, your way.
            </p>
            {!token ? (
              <a
                href={`${AUTH_ENDPOINT}?client_id=${
                  import.meta.env.VITE_SPOTIFY_ID
                }&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
                className="heroBtn"
              >
                <QueueMusic fontSize="large" className="musicIcon" />
                <p>Generate Now!</p>
              </a>
            ) : (
              <a className="heroBtn" href="/dashboard">
                <QueueMusic fontSize="large" className="musicIcon" />
                <p>Generate Now!</p>
              </a>
            )}
          </div>
          <div className="heroImg">
            <img src="/HeroImg.png" />
          </div>
        </div>
      </div>
    </div>
  );
}
