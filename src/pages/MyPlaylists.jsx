import React from 'react'
import Sidebar from '../components/Sidebar'
import Playlists from './Playlists'

export default function MyPlaylists() {
  return (
    <div className="dashboardContainer">
      <div className="sideBar">
        <Sidebar />
      </div>
      <div className="generateSection">
        <Playlists />
      </div>
    </div>
  )
}
