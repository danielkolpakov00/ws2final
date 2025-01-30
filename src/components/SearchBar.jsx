import React, { useState } from "react";

const ICONS = {
  search: '/icons/search-xp.ico',
  clearSearch: '/icons/clear-search.ico',
  searchIcon: '/icons/serch.ico'  // Added the search icon from Toolbar
};

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    if (query) {
      onSearch(query);
    }
  };

  const handleClearSearch = () => {
    setQuery("");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center space-x-2 p-3 rounded-xp bg-gradient-to-b from-xpGray to-xpWhite border-2 border-b-3 border-r-3 shadow-insetXP">
        <img
          src={ICONS.searchIcon}
          alt="Search"
          className="block w-6 h-6"
        />
        <input
          type="text"
          placeholder="Search for a track..."
          className="flex-grow p-2 text-black font-xptahoma bg-gradient-to-b from-xpWhite to-xpGray border border-xpGray rounded-xp shadow-inner focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        {query && (
          <img
            src={ICONS.clearSearch}
            alt="Clear search"
            className="block w-6 h-6 cursor-pointer"
            onClick={handleClearSearch}
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
