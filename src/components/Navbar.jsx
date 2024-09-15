import React from "react";
import "../styles/Navbar.css";
import { useState, useEffect } from "react";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import { GitHub, LinkedIn } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";

function Navbar(props) {
  const [style, setStyle] = useState("hidden");
  const [mobileNav, setMobileNav] = useState(true);
  
  const onClick = () => {
    setMobileNav(!mobileNav);
    if (mobileNav == true) {
      setStyle("hidden");
    } else {
      setStyle("visible");
    }
  };

  let authUrl = window.localStorage.getItem("authorizeUrl");
  
  return (
    <>
      <nav className="navbarContainer">
        <div className="logoContainer">
          <a href="/">
            <img src="/playlisty_face.png" />
            <h1>Playlisty</h1>
          </a>
        </div>
        <ul className="navbarItems">
          <li className="home">
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/projects">Features</a>
          </li>
          <li>
            <a href="">About Us</a>
          </li>
          <li>
            <a href="/about">Contact Us</a>
          </li>
        </ul>
        <div className="navButtons">
          {!props.token ? (
            <div className="loginBtns">
              <a
                href={authUrl}
                className="logInBtn"
              >
                Log In
              </a>
              <a
                href={authUrl}
                className="signUpBtn"
              >
                Sign Up
              </a>
            </div>
          ) : (
            <div className="dashboardBtns">
              <p onClick={props.logout} className="logOutBtn">Logout</p>
              <a href="/dashboard" className="dashboardBtn">Dashboard</a>
            </div>
          )}
          <div className="menuBtn">
            <a onClick={onClick}>
              <MenuIcon fontSize="large" className="menuBtn" />
            </a>
          </div>
        </div>
      </nav>
      <div style={{ visibility: style }} className="mobileNavContainer">
        <ul className="mobileNavItems">
          <li className="home">
            <a href="/">home</a>
          </li>
          <li>
            <a href="/projects">projects</a>
          </li>
          <li>
            <a href="">resume</a>
          </li>
          <li>
            <a href="/about">about</a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Navbar;
