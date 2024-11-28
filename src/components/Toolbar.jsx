import React, { useState, useEffect } from "react";
import WindowsLogo from "../assets/WindowsLogo.svg";

const Toolbar = () => {
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
    <div className="sticky top-0 z-100 flex items-center justify-between p-2 bg-gradient-to-b from-xpGreen to-green-500 text-black text-shadow-md font-xptahoma">
      {/* Windows Logo */}
      <img
        src={WindowsLogo}
        alt="Windows Logo"
        className="w-12 h-12"
      />

      {/* Toolbar Title */}
      <span className="text-4xl text-white font-xptahoma">Toolbar</span>

      {/* Timer */}
      <div className="flex items-center gap-2">
        <button className="text-xl text-white font-xptahoma bg-transparent border-none">
          {currTime}
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
