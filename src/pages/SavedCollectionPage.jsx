import React, { useState, useEffect } from "react";

const SavedCollectionPage = () => {
  const [savedTracks, setSavedTracks] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedTracks")) || [];
    setSavedTracks(saved);
  }, []);

  const removeTrack = (index) => {
    const updatedTracks = [...savedTracks];
    updatedTracks.splice(index, 1);
    setSavedTracks(updatedTracks);
    localStorage.setItem("savedTracks", JSON.stringify(updatedTracks));
  };

  return (
    <div className="p-6 mx-auto mt-6 mb-6 max-w-2xl font-[Tahoma,sans-serif] bg-gradient-to-b from-gray-200 to-white rounded-[3px] ">
      <h1 className="text-3xl font-bold text-center mb-6 text-black font-xptahoma text-shadow-[1px_1px_0_#FFFFFF]">
        Saved Tracks
      </h1>

      {savedTracks.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {savedTracks.map((track, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-to-b from-gray-200 to-white border-2 border-white border-b-[3px] border-r-[3px] border-gray-500 rounded-[3px] shadow-[inset_2px_2px_0_#FFFFFF,inset_-2px_-2px_0_#808080] transition-transform duration-200 ease-in-out hover:scale-105"
            >
              <h3 className="font-bold font-xptahoma text-3xl text-black text-shadow-[1px_1px_0_#FFFFFF]">
                {track.name}
              </h3>
              <p className="text-[#1D5F8A] font-xptahoma">{track.artist.name}</p>
              <button
                onClick={() => removeTrack(index)}
                className="w-full mt-3 py-2 font-[Tahoma,sans-serif] bg-gradient-to-b from-gray-200 to-gray-400 border-2 border-white border-b-[3px] border-r-[3px] border-gray-500 rounded-[3px] shadow-[inset_1px_1px_0_#FFFFFF,inset_-1px_-1px_0_#808080] cursor-pointer text-black text-center hover:bg-gray-300"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-black font-xptahoma">
          No saved tracks.
        </p>
      )}
    </div>
  );
};

export default SavedCollectionPage;
