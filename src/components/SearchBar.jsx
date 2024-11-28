import React, { useState } from "react";
import SearchIcon from "../assets/magnifying_glass.ico";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query) {
      onSearch(query);
    }
  };

  return (
    <div
      className="flex mb-6 items-center space-x-2 p-3 rounded-xp bg-gradient-to-b from-xpGray to-xpWhite border-2 border-b-3 border-r-3 shadow-insetXP"
    >
      {/* Input Field */}
      <input
        type="text"
        placeholder="Search for a track..."
        className="flex-grow p-2 text-black font-xptahoma bg-gradient-to-b from-xpWhite to-xpGray border border-xpGray rounded-xp shadow-inner focus:outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="px-4 py-2 text-black font-xptahoma bg-gradient-to-b from-xpWhite to-xpGray border-2 border-xpWhite border-b-3 border-r-3 border-xpGray rounded-xp shadow-insetXP cursor-pointer"
      >
        <img
          src={SearchIcon}
          alt="SearchIcon"
          className="block w-6 h-6"
        />
      </button>
    </div>
  );
};

export default SearchBar;
