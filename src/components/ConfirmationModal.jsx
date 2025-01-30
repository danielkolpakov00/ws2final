import React from 'react';

const ConfirmationModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div 
        className="relative p-4 w-80"
        style={{
          background: "linear-gradient(to bottom, #E3E3E3, #FFFFFF)",
          border: "2px solid #FFFFFF",
          borderBottom: "3px solid #A9A9A9",
          borderRight: "3px solid #A9A9A9",
          borderRadius: "3px",
          boxShadow: "inset 2px 2px 0 #FFFFFF, inset -2px -2px 0 #808080",
        }}
      >
        {/* Modal Header */}
        <div 
          className="flex items-center p-2 mb-4"
          style={{
            background: "linear-gradient(to bottom, #0058e7, #3390ff)",
            margin: "-1rem -1rem 1rem -1rem",
          }}
        >
          <img src="/icons/WindowsLogo.svg" alt="Windows" className="w-4 h-4 mr-2" />
          <span className="text-white font-bold font-xptahoma">Windows</span>
        </div>

        {/* Modal Content */}
        <div className="flex items-center mb-4">
          <img src="/icons/floppysave.ico" alt="Save" className="w-8 h-8 mr-4" />
          <p className="text-black font-xptahoma">{message}</p>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-1 font-xptahoma bg-gradient-to-b from-gray-100 to-gray-300 border-2 border-white border-b-gray-400 border-r-gray-400 rounded shadow-inner hover:from-blue-500 hover:to-blue-600 hover:text-white focus:outline-none"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
