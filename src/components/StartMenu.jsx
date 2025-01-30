import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Remove all previous icon imports and replace with icon path constants
const ICONS = {
  xpLogo: '/icons/xp.png',
  explorer: '/icons/explorer.ico',
  express: '/icons/express.ico',
  media: '/icons/Windows_Media_Player.ico',
  documents: '/icons/documents.ico',
  pictures: '/icons/pictures.ico',
  music: '/icons/music.ico',
  computer: '/icons/computer.ico',
  controlPanel: '/icons/ctrlk.ico',
  help: '/icons/Help_And_Support.ico',
  search: '/icons/serch.ico',
  logOff: '/icons/logoff.ico',
  turnOff: '/icons/shutdown.ico',
  minesweeper: '/icons/minesweeper.ico',
  paint: '/icons/paint.ico',
};

const StartMenu = ({ isOpen, onClose, onMinesweeperClick, onPaintClick, onShowWindow }) => {
  const navigate = useNavigate();
  const [showAllPrograms, setShowAllPrograms] = useState(false);
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 });
  const allProgramsRef = useRef(null);
  
  const handleLastFMClick = () => {
    navigate('/');
    onShowWindow();
    onClose();
  };
  
  useEffect(() => {
    if (showAllPrograms && allProgramsRef.current) {
      const rect = allProgramsRef.current.getBoundingClientRect();
      setSubmenuPosition({
        top: rect.top,
        left: rect.right
      });
    }
  }, [showAllPrograms]);
  
  if (!isOpen) return null;

  const handleAllProgramsClick = () => {
    setShowAllPrograms(!showAllPrograms);
  };

  const handleMinesweeperClick = () => {
    if (typeof onMinesweeperClick === 'function') {
      onMinesweeperClick();
      setShowAllPrograms(false);
      onClose();
    }
  };

  const handlePaintClick = () => {
    if (typeof onPaintClick === 'function') {
      onPaintClick();
      setShowAllPrograms(false);
      onClose();
    }
  };

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          bottom: '36px',
          left: '0',
          width: '320px',
          background: 'linear-gradient(to bottom, #e7f0fd, #c9e2fa)',
          border: '2px solid #5a8fd9',
          boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.5)',
          borderRadius: '5px',
          fontFamily: 'Tahoma, sans-serif',
          color: '#000',
          zIndex: 9999,
        }}
      >
        {/* User section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
          background: 'linear-gradient(to right, #1d4bb5, #2d6ce0)',
          color: '#fff',
          borderBottom: '2px solid #5a8fd9',
        }}>
          <img 
            src={ICONS.xpLogo}
            alt="User"
            style={{
              width: '40px',
              height: '40px',
              marginRight: '10px'
            }}
          />
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>User</span>
        </div>

        {/* Menu items */}
        <div style={{ display: 'flex', height: 'calc(100% - 120px)', position: 'relative' }}>
          {/* Left panel */}
          <div style={{
            width: '50%',
            background: '#f3f9ff',
            borderRight: '1px solid #5a8fd9',
            padding: '10px',
            overflowY: 'auto',
          }}>
            <MenuItem 
              icon={ICONS.explorer}
              text="Last.fm Explorer" 
              onClick={handleLastFMClick}
            />
            <MenuItem icon={ICONS.express} text="Outlook Express" />
            <MenuItem icon={ICONS.media} text="Windows Media Player" />
            <div style={{ borderTop: '1px solid #d3e3f7', margin: '8px 0' }}></div>
            <div ref={allProgramsRef}>
              <MenuItem 
                text="All Programs" 
                hasArrow 
                onClick={handleAllProgramsClick}
                isActive={showAllPrograms}
              />
            </div>
            {showAllPrograms && (
              <div style={{
                position: 'fixed',
                left: `${submenuPosition.left}px`,
                top: `${submenuPosition.top}px`,
                width: '200px',
                background: '#f3f9ff',
                border: '1px solid #5a8fd9',
                boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
                zIndex: 10000,
              }}>
                <MenuItem 
                  icon={ICONS.minesweeper}
                  text="Minesweeper" 
                  onClick={handleMinesweeperClick}
                />
                <MenuItem 
                  icon={ICONS.paint}
                  text="Paint" 
                  onClick={handlePaintClick}
                />
              </div>
            )}
          </div>

          {/* Right panel */}
          <div style={{
            width: '50%',
            padding: '10px',
            background: '#f3f9ff',
            overflowY: 'auto',
          }}>
            <MenuItem icon={ICONS.documents} text="My Documents" />
            <MenuItem icon={ICONS.pictures} text="My Pictures" />
            <MenuItem icon={ICONS.music} text="My Music" />
            <MenuItem icon={ICONS.computer} text="My Computer" />
            <div style={{ borderTop: '1px solid #d3e3f7', margin: '8px 0' }}></div>
            <MenuItem icon={ICONS.controlPanel} text="Control Panel" />
            <MenuItem icon={ICONS.help} text="Help and Support" />
            <MenuItem icon={ICONS.search} text="Search" />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 10px',
          background: '#1d4bb5',
          color: '#fff',
          borderTop: '2px solid #5a8fd9',
        }}>
          <button 
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#fff',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <img 
              src={ICONS.logOff}
              alt=""
              style={{ 
                width: '24px', 
                height: '24px'
              }}
            />
            Log Off
          </button>
          <button 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#fff',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <img 
              src={ICONS.turnOff}
              alt=""
              style={{ 
                width: '24px', 
                height: '24px'
              }}
            />
            Turn Off Computer
          </button>
        </div>
      </div>
    </>
  );
};

const MenuItem = ({ icon, text, hasArrow, onClick, isActive }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '5px 8px',
      cursor: 'pointer',
      fontSize: '13px',
      color: '#000',
      borderRadius: '3px',
      transition: 'background 0.2s',
      background: isActive ? '#e3e9f9' : 'transparent',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = '#e3e9f9';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = isActive ? '#e3e9f9' : 'transparent';
    }}
  >
    {icon && <img 
      src={icon} 
      alt=""
      style={{ 
        width: '24px', 
        height: '24px', 
        marginRight: '10px' 
      }}
    />}
    <span style={{ flex: 1 }}>{text}</span>
    {hasArrow && <span style={{ fontSize: '12px', marginLeft: 'auto' }}>▶</span>}
  </div>
);

export default StartMenu;
