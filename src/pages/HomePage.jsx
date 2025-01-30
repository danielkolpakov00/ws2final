import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import ResultList from "../components/ResultList";
import { getTopTracks, searchTracks } from "../api"; // Importing the top tracks API

const HomePage = ({ savedTracks = [], onSaveTrack }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Fetch top tracks when the page loads
  useEffect(() => {
    getTopTracks().then(setSearchResults); // Fetch top tracks from Last.fm
  }, []);

  // Handle search input
  const handleSearch = (query) => {
    if (!query.trim()) {
      // If search is empty, show top tracks
      getTopTracks().then(results => {
        console.log('Setting top tracks:', results);
        setSearchResults(results);
        setSearchPerformed(false);
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    searchTracks(query)
      .then(results => {
        console.log('Search results:', results);
        if (!results || !Array.isArray(results)) {
          setSearchResults([]);
        } else {
          setSearchResults(results);
        }
        setSearchPerformed(true);
      })
      .catch(err => {
        setError(err);
        setSearchResults([]);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div style={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Search form container */}
      <div style={{ padding: '20px', flexShrink: 0 }}>
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Results container */}
      <div style={{ 
        flex: 1,
        overflow: 'hidden',
        position: 'relative'
      }}>
        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!isLoading && !error && (
          <ResultList 
            results={searchResults}
            favorites={savedTracks?.map(track => track.name) || []}
            onFavoriteClick={onSaveTrack}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
