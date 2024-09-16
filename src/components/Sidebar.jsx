import React from "react";
import "../styles/Sidebar.css";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EmailIcon from "@mui/icons-material/Email";
import FeedIcon from "@mui/icons-material/Feed";
import { useState, useEffect } from "react";
import { QueueMusic, SettingsSuggestTwoTone } from "@mui/icons-material";
import axios from "axios";

export default function Sidebar() {
  const [profile, setProfile] = useState(null);
  const [userId, setUserId] = useState("");
  const [error, setError] = useState(null);
  
  let token = window.localStorage.getItem("token");
  async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await result.json();
  }

  useEffect(() => {
    const getProfile = async () => {
      try {
        const userProfile = await fetchProfile(token);

        const userID = userProfile.id;
        let userId = window.localStorage.setItem("userId", userID);

        setUserId(userId);
        setProfile(userProfile);
      } catch (err) {
        setError(err.message);
      }
    };

    if (token) {
      getProfile();
    }
  }, [token]);

  const logout = () => {
    window.localStorage.removeItem("token");
  };

  return (
    <div className="sidebarContainer">
      <div className="playlistyLogo">
        <img alt="Playlisty Logo" src="/playlisty_face.png" />
        <p>Playlisty</p>
      </div>
      <div className="sidebarItems">
        <a className="sidebarGenerate" href="/dashboard">
          <div className="sparkles">
            <AutoAwesomeIcon />
          </div>
          <p>Generate Playlist</p>
        </a>
        <a className="sidebarGenerate" href="/playlists">
          <div className="sparkles">
            <QueueMusic />
          </div>
          <p>My Playlists</p>
        </a>
        <a className="sidebarGenerate" href="">
          <div className="sparkles">
            <EmailIcon />
          </div>
          <p>Contact us</p>
        </a>
        <a className="sidebarGenerate" href="">
          <div className="sparkles">
            <FeedIcon />
          </div>
          <p>What's New!</p>
        </a>
      </div>
      {profile && (
        <div className="userData">
          <img src={profile.images[0]?.url} />
          <div className="userName">
            <p>{profile.display_name}</p>
            <a href="/" onClick={logout}>
              Log Out
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
