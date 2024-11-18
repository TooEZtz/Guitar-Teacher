import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GuitarTutor from "./components/GuitarTutor";


const App = () => {
  return (
    <Router>
      <div className="app">
        
        <Routes>
          <Route path="/" element={<GuitarTutor />} />
        </Routes>
        
      </div>
    </Router>
  );
};

export default App;