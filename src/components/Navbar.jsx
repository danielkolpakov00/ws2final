import React, { useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { gsap } from "gsap";
import WindowsXP from "../assets/30fps_pixelated.gif";
import HomePageIcon from "../assets/homepage.ico";
import FloppySave from "../assets/floppysave.ico";
import TypeIt from "typeit-react";

const Navbar = () => {
  const navbarRef = useRef();

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true }); // Smooth infinite loop with reverse

    tl.to(navbarRef.current, {
      duration: 8, // Animation duration
      background: `linear-gradient(90deg, #1E90FF, #87CEEB)`,
      backgroundSize: "300% 300%", // Makes the gradient move
      backgroundPosition: "200% center", // Moves the gradient smoothly
      ease: "linear",
    });
  }, []);

  return (
    <nav
      ref={navbarRef}
      className="relative p-2 mb-6  flex justify-between items-center bg-gradient-to-b from-[#0078D7] to-[#5CAAE5] rounded-[3px] shadow-[inset_2px_2px_0_#A3D3F7,inset_-2px_-2px_0_#003E73]"
    >
      <div className="flex items-center space-x-3">
        <img
          src={WindowsXP}
          alt="Windows XP"
          className="block w-24 h-24 border-2 border-white border-b-3 border-r-3 border-[#003E73]"
        />
        <h1 className="font-xptahoma text-8xl text-xp text-white text-shadow-md">
        <TypeIt
          options={{
            speed: 200,
            cursorChar: '<span className="custom-caret">|</span>',
          }}
        
        >Last.fm</TypeIt> 
        </h1>
      </div>
      <div className="flex space-x-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `font-[Tahoma,sans-serif] ${
              isActive
                ? "font-bold text-[#8CC63F] underline text-shadow-md"
                : "text-white hover:underline text-shadow-md"
            }`
          }
        >
          <img
            src={HomePageIcon}
            alt="Home Page Icon"
            className="block w-12 h-12 border-b-3 border-r-3"
           
          />
        </NavLink>
        <NavLink
          to="/saved"
          className={({ isActive }) =>
            `font-[Tahoma,sans-serif] ${
              isActive
                ? "font-bold text-[#8CC63F] underline text-shadow-md"
                : "text-white hover:underline text-shadow-md"
            }`
          }
        >
          <img
            src={FloppySave}
            alt="Floppy Disk"
            className="block w-12 h-12 border-b-3 border-r-3"
          />
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
