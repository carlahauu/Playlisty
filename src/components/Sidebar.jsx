import React from 'react'
import "../styles/Sidebar.css"
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EmailIcon from '@mui/icons-material/Email';
import FeedIcon from '@mui/icons-material/Feed';
import { QueueMusic } from '@mui/icons-material';

export default function Sidebar() {
  return (
    <div className="sidebarContainer">
        <div className="playlistyLogo">
            <img alt='Playlisty Logo' src='/playlisty_face.png' />
            <p>Playlisty</p>
        </div>
        <div className="sidebarItems">
            <a className='sidebarGenerate' href=''>
                <div className="sparkles"><AutoAwesomeIcon /></div>
                <p>Generate Playlist</p>
            </a>
            <a className='sidebarGenerate' href=''>
                <div className="sparkles"><QueueMusic /></div>
                <p>My Playlists</p>
            </a>
            <a className='sidebarGenerate' href=''>
                <div className="sparkles"><EmailIcon /></div>
                <p>Contact us</p>
            </a>
            <a className='sidebarGenerate' href=''>
                <div className="sparkles"><FeedIcon /></div>
                <p>What's New!</p>
            </a>
        </div>
    </div>
  )
}
