import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const ICONS = {
  floppysave: '/icons/floppysave.ico',
  home: '/icons/homepage.ico'  // Add home icon
};

const Toolbar = () => {
  const navigate = useNavigate();
  // State to hold the current time
  const [currTime, setCurrTime] = useState(new Date().toLocaleTimeString());

  // Update the time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrTime(new Date().toLocaleTimeString());
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex top-0 z-100 flex items-center justify-between p-2 bg-gradient-to-b from-xpGreen to-green-500 text-black text-shadow-md font-xptahoma">
      {/* Windows Logo */}
      <img
        src="/icons/WindowsLogo.svg"
        alt="Windows Logo"
        className="w-12 h-12"
      />

      {/* Toolbar Title */}
      <div className="flex items-center gap-2">
        <span className="text-4xl text-white font-xptahoma">Toolbar</span>
      </div>

      {/* Timer and Icons - moved to the right */}
      <div className="flex items-center gap-4">
       
        <div className="toolbar-group flex items-center gap-2">
          <button onClick={() => navigate('/')} className="p-1">
            <img src={ICONS.home} alt="Home" className="w-8 h-8" />
          </button>
          
          <button onClick={() => navigate('/saved')} className="p-1">
            <img src={ICONS.floppysave} alt="Saved Collection" className="w-8 h-8" />
          </button>
          <div className="text-xl text-white font-xptahoma">
          {currTime}
        </div>
        
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
