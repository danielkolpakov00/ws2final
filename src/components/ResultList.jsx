import React from "react";
import { Link } from "react-router-dom";
import Microphone from "../assets/microphone.ico";

const ResultList = ({ results }) => {
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
            <p
              className="text-2xl font-xptahoma flex items-center justify-center gap-2"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <img
                src={Microphone}
                alt="microphone"
                className="w-6 h-6"
                style={{
                  verticalAlign: "middle",
                }}
              />
              {track.artist}
            </p>

            {/* View Details Link */}
            <div style={{ marginTop: "auto" }}>
              <Link
                to={`/details?artist=${encodeURIComponent(
                  track.artist
                )}&track=${encodeURIComponent(track.name)}`}
                style={{
                  display: "inline-block",
                  fontFamily: "xptahoma, sans-serif",
                  color: "#D91E5D", // Windows XP Pink
                  textDecoration: "none",
                  paddingTop: "10px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.textDecoration = "underline")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.textDecoration = "none")
                }
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultList;
