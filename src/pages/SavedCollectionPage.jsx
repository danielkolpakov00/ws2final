import React from "react";
import ResultList from "../components/ResultList";

const SavedCollectionPage = ({ savedTracks, onSaveTrack }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-xptahoma mb-4">Saved Tracks</h1>
      {savedTracks.length > 0 ? (
        <ResultList 
          results={savedTracks}
          favorites={savedTracks.map(track => track.name)}
          onFavoriteClick={onSaveTrack}
        />
      ) : (
        <p className="text-center text-black font-xptahoma">
          No saved tracks.
        </p>
      )}
    </div>
  );
};

export default SavedCollectionPage;
