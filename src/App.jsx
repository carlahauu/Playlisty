import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import Generate from "./pages/Generate";
import Landing from "./pages/Landing";
import GeneratedPlaylist from "./pages/GeneratedPlaylist";
import MyPlaylists from "./pages/MyPlaylists";

function App() {
  return (
    <>
      <div className="App">
        <div className="appContent">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/generated" element={<GeneratedPlaylist />}/>
            <Route path="/playlists" element={<MyPlaylists />}/>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;