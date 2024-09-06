import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <>
      <div className="App">
        <div className="appContent">
          <Routes>
            <Route path="/" />
            <Route path="/dashboard" element={<Dashboard />}/>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;