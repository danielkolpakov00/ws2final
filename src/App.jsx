import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import SavedCollectionPage from "./pages/SavedCollectionPage";
import Navbar from "./components/Navbar";
import Toolbar from "./components/Toolbar"

function App() {
  return (
    <Router>
      {/* Windows XP Background */}
      <div
        style={{
          background: "linear-gradient(to bottom, #1E90FF, #87CEEB)", // XP Desktop-like gradient
          minHeight: "100vh",
          padding: "20px",
          fontFamily: "Tahoma, sans-serif", // XP font
        }}
      >
        
        <Navbar />
        <div
          style={{
            maxWidth: "1024px",
            margin: "0 auto",
            padding: "0px",
            background: "linear-gradient(to bottom, #E3E3E3, #FFFFFF)", // Content container gradient
            border: "2px solid #FFFFFF",
            borderBottom: "3px solid #A9A9A9",
            borderRight: "3px solid #A9A9A9",
            borderRadius: "3px",
            boxShadow: "inset 2px 2px 0 #FFFFFF, inset -2px -2px 0 #808080",
          }}
        >
          <Toolbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/details" element={<DetailPage />} />
            <Route path="/saved" element={<SavedCollectionPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
