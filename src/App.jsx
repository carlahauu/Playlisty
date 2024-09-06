import "./App.css";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <div className="App">
        <div className="appContent">
          <Routes>
            <Route path="/" />
          </Routes>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;