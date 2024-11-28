import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getTrackInfo } from "../api";

const DetailPage = () => {
  const [searchParams] = useSearchParams();
  const artist = searchParams.get("artist");
  const track = searchParams.get("track");
  const [trackInfo, setTrackInfo] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (artist && track) {
      getTrackInfo(artist, track).then((info) => {
        setTrackInfo(info);

        // Check if the track is already in "liked" tracks
        const savedTracks = JSON.parse(localStorage.getItem("savedTracks")) || [];
        const isTrackLiked = savedTracks.some(
          (savedTrack) => savedTrack.name === info.name && savedTrack.artist.name === info.artist.name
        );
        setIsLiked(isTrackLiked);
      });
    }
  }, [artist, track]);

  const toggleLike = () => {
    const savedTracks = JSON.parse(localStorage.getItem("savedTracks")) || [];

    if (isLiked) {
      // Remove the track from likes
      const updatedTracks = savedTracks.filter(
        (savedTrack) =>
          savedTrack.name !== trackInfo.name || savedTrack.artist.name !== trackInfo.artist.name
      );
      localStorage.setItem("savedTracks", JSON.stringify(updatedTracks));
      setIsLiked(false);
      alert("Track removed from favorites!");
    } else {
      // Add the track to likes
      localStorage.setItem("savedTracks", JSON.stringify([...savedTracks, trackInfo]));
      setIsLiked(true);
      alert("Track added to favorites!");
    }
  };

  if (!trackInfo)
    return (
      <div className="flex items-center justify-center min-h-screen font-xptahoma text-xl text-gray-700">
        Loading...
      </div>
    );

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="p-6 pb-8 mx-auto mt-10 mb-8 max-w-6xl bg-gradient-to-b from-gray-200 to-white border-2 border-white rounded-md shadow-[inset_3px_3px_0px_#FFFFFF,inset_-3px_-3px_0px_#808080]">
        {/* Track Name */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4 font-xptahoma">
          {trackInfo.name}
        </h1>

        {/* Artist Name */}
        <p className="text-xl text-center text-blue-800 mb-6 font-xptahoma">
          Artist: <span className="font-semibold">{trackInfo.artist.name}</span>
        </p>

        {/* Album Image */}
        {trackInfo.album?.image?.[3]?.["#text"] && (
          <div className="flex justify-center mb-6">
            <img
              src={trackInfo.album.image[3]["#text"]}
              alt={`${trackInfo.album.title} album art`}
              className="rounded-md shadow-md"
            />
          </div>
        )}

        {/* Album Name */}
        {trackInfo.album && (
          <p className="text-lg text-center text-gray-700 mb-4 font-xptahoma">
            Album: <span className="font-medium">{trackInfo.album.title}</span>
          </p>
        )}

        {/* Track Duration */}
        {trackInfo.duration && (
          <p className="text-lg text-center text-gray-700 mb-4 font-xptahoma">
            Duration:{" "}
            <span className="font-medium">
              {Math.floor(trackInfo.duration / 60)}:
              {(trackInfo.duration % 60).toString().padStart(2, "0")} minutes
            </span>
          </p>
        )}

        {/* Play Count */}
        {trackInfo.playcount && (
          <p className="text-lg text-center text-gray-700 mb-4 font-xptahoma">
            Play Count:{" "}
            <span className="font-medium">{Number(trackInfo.playcount).toLocaleString()}</span>
          </p>
        )}

        {/* Listeners */}
        {trackInfo.listeners && (
          <p className="text-lg text-center text-gray-700 mb-6 font-xptahoma">
            Listeners:{" "}
            <span className="font-medium">
              {Number(trackInfo.listeners).toLocaleString()}
            </span>
          </p>
        )}

        {/* Tags (Genres) */}
        {trackInfo.toptags?.tag && (
          <div className="text-lg text-center text-gray-700 mb-6 font-xptahoma">
            <p>Genres:</p>
            <ul className="flex flex-wrap justify-center gap-2 mt-2">
              {trackInfo.toptags.tag.map((tag) => (
                <li
                  key={tag.name}
                  className="px-3 py-1 bg-gray-300 rounded-md shadow-md font-medium"
                >
                  {tag.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Save/Remove Button */}
        <button
          onClick={toggleLike}
          className={`w-full py-3 text-lg ${
            isLiked
              ? "bg-gradient-to-b from-red-300 to-red-500 hover:bg-red-400"
              : "bg-gradient-to-b from-gray-300 to-gray-500 hover:bg-gray-400"
          } border border-white rounded-md shadow-[inset_2px_2px_0px_#FFFFFF,inset_-2px_-2px_0px_#808080] font-xptahoma text-gray-800 hover:shadow-[inset_1px_1px_0px_#FFFFFF,inset_-1px_-1px_0px_#808080] transition duration-200`}
        >
          {isLiked ? "Remove from Favorites" : "Save to Favorites"}
        </button>
      </div>
    </div>
  );
};

export default DetailPage;
