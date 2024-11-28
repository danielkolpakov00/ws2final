import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import ResultList from "../components/ResultList";
import { getTopTracks, searchTracks } from "../api"; // Importing the top tracks API

const HomePage = () => {
  const [results, setResults] = useState([]);

  // Fetch top tracks when the page loads
  useEffect(() => {
    getTopTracks().then(setResults); // Fetch top tracks from Last.fm
  }, []);

  // Handle search input
  const handleSearch = (query) => {
    searchTracks(query).then(setResults); // Search tracks based on user query
  };

  return (
    <div className="m-2">
      <SearchBar onSearch={handleSearch} />
      <ResultList results={results} />
    </div>
  );
};

export default HomePage;
