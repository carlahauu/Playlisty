import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

export function Dashboard() {
  return (
    <div className="dashboardContainer">
      <div className="sideBar">
        <Sidebar />
      </div>
    </div>
  );
}
