import React, { useState } from "react";
import { Link } from "react-router-dom";
import ConfirmationModal from './ConfirmationModal';

const ICONS = {
  winampIcon: '/icons/microphone.ico',
  floppysave: '/icons/floppysave.ico',      // Use floppysave as favorite icon
  floppysaveActive: '/icons/floppysave.ico'  // You can use the same icon or create an active version
};

const ResultList = ({ results = [], favorites = [], onFavoriteClick }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [savedTrackName, setSavedTrackName] = useState('');

  // Add console log to debug
  console.log('ResultList received results:', results);

  // Guard against null or undefined results
  if (!results || !Array.isArray(results)) {
    console.log('No valid results array received');
    return <div>No results found</div>;
  }

  // Only show results if there are any
  if (results.length === 0) {
    return <div>No results found</div>;
  }

  const handleSaveClick = (track) => {
    const trackToSave = {
      name: track.name,
      artist: track.artist,
      url: track.url,
      savedAt: new Date().toISOString()
    };
    if (typeof onFavoriteClick === 'function') {
      onFavoriteClick(trackToSave);
      setSavedTrackName(track.name);
      setModalOpen(true);
    }
  };

  return (
    <div>
      {/* Result List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {results.map((track, index) => (
          <div
            key={index}
            className="p-4 text-center flex flex-col justify-between h-full"
            style={{
              background: "linear-gradient(to bottom, #E3E3E3, #FFFFFF)", // XP-style gradient
              border: "2px solid #FFFFFF",
              borderBottom: "3px solid #A9A9A9",
              borderRight: "3px solid #A9A9A9",
              borderRadius: "3px",
              boxShadow: "inset 2px 2px 0 #FFFFFF, inset -2px -2px 0 #808080",
              transition: "transform 0.2s ease-in-out",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {/* Track Name */}
            <h3 className="font-bold text-3xl font-xptahoma">{track.name}</h3>

            {/* Artist Info */}
            <p className="text-2xl font-xptahoma flex items-center justify-center gap-2">
              <img
                src={ICONS.winampIcon}
                alt="Winamp Icon"
                className="w-6 h-6"
              />
              {track.artist}
            </p>

            {/* View Details Link */}
            <div className="flex items-center justify-between mt-4 px-2">
              <Link
                to={`/details?artist=${encodeURIComponent(
                  track.artist
                )}&track=${encodeURIComponent(track.name)}`}
                className="text-pink-600 hover:underline font-xptahoma"
              >
                View Details
              </Link>
              <img
                src={(favorites || []).includes(track.name) ? ICONS.floppysaveActive : ICONS.floppysave}
                alt="Save Track"
                className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
                onClick={() => handleSaveClick(track)}
              />
            </div>
          </div>
        ))}
      </div>
      
      <ConfirmationModal
        isOpen={modalOpen}
        message={`"${savedTrackName}" has been ${favorites.includes(savedTrackName) ? 'removed from' : 'added to'} your collection.`}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default ResultList;
