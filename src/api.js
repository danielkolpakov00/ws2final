import axios from "axios";

const API_KEY = "30ef3df7635f69c1204756796f989e4b"; // Replace with your Last.fm API key
const BASE_URL = "https://ws.audioscrobbler.com/2.0/";

export const searchTracks = (query) => {
  return axios
    .get(BASE_URL, {
      params: {
        method: "track.search",
        track: query,
        api_key: API_KEY,
        format: "json",
      },
    })
    .then((res) => res.data.results.trackmatches.track)
    .catch((err) => {
      console.error("Error fetching search results:", err);
      return [];
    });
};

export const getTrackInfo = (artist, track) => {
  return axios
    .get(BASE_URL, {
      params: {
        method: "track.getInfo",
        artist,
        track,
        api_key: API_KEY,
        format: "json",
      },
    })
    .then((res) => res.data.track)
    .catch((err) => {
      console.error("Error fetching track info:", err);
      return null;
    });
};
export const getTopTracks = async () => {
  const API_KEY = "30ef3df7635f69c1204756796f989e4b"; // Replace with your API key
  const API_URL = `https://ws.audioscrobbler.com/2.0/?method=chart.getTopTracks&api_key=${API_KEY}&format=json&limit=10`;

  const response = await fetch(API_URL);
  const data = await response.json();

  // Transform Last.fm API response into a usable format
  return data.tracks.track.map((track) => ({
    name: track.name,
    artist: track.artist.name,
    listeners: track.listeners,
    image: track.image?.[2]?.["#text"], // Medium-sized image
  }));
};
