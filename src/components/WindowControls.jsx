import React from 'react';

const WindowControls = ({ onClose, onMinimize, onMaximize }) => {
  return (
    <div className="flex space-x-[2px]">
      <button 
        onClick={onMinimize}
        className="w-[18px] h-[18px] bg-[#ECE9D8] border border-[#FFFFFF] border-r-[#404040] border-b-[#404040] flex items-center justify-center hover:border-[#0A246A] hover:bg-[#B6BDD2] active:border active:border-[#404040] active:border-r-[#FFFFFF] active:border-b-[#FFFFFF]"
      >
        <div className="w-[8px] h-[2px] bg-black transform translate-y-[2px]" />
      </button>
      <button 
        onClick={onMaximize}
        className="w-[18px] h-[18px] bg-[#ECE9D8] border border-[#FFFFFF] border-r-[#404040] border-b-[#404040] flex items-center justify-center hover:border-[#0A246A] hover:bg-[#B6BDD2] active:border active:border-[#404040] active:border-r-[#FFFFFF] active:border-b-[#FFFFFF]"
      >
        <div className="w-[8px] h-[8px] border border-black transform translate-y-[-1px]" />
      </button>
      <button
        onClick={onClose}
        className="w-[18px] h-[18px] bg-[#ECE9D8] border border-[#FFFFFF] border-r-[#404040] border-b-[#404040] flex items-center justify-center hover:border-[#0A246A] hover:bg-[#B6BDD2] active:border active:border-[#404040] active:border-r-[#FFFFFF] active:border-b-[#FFFFFF]"
      >
        <div className="w-[10px] h-[10px] flex items-center justify-center relative">
          <div className="absolute w-[12px] h-[2px] bg-black transform rotate-45" />
          <div className="absolute w-[12px] h-[2px] bg-black transform -rotate-45" />
        </div>
      </button>
    </div>
  );
};

export default WindowControls;
