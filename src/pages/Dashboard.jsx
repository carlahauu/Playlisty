import React from "react";
import Generate from "./Generate";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

export function Dashboard() {
  return (
    <div className="dashboardContainer">
      <div className="sideBar">
        <Sidebar />
      </div>
      <div className="generateSection">
        <Generate />
      </div>
    </div>
  );
}
