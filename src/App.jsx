import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import Generate from "./pages/Generate";

function App() {
  return (
    <>
      <div className="App">
        <div className="appSidebar">
          <Sidebar />
        </div>
        <div className="appContent">
          <Routes>
            <Route path="/" />
            <Route path="/dashboard" element={<Generate />}/>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;