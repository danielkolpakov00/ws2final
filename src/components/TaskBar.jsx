import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import xpLogo from '../assets/xp.png';

const ICONS = {
  start: '/icons/start.ico',
  windows: '/icons/windows.ico',
  messenger: '/icons/messenger.ico',
  volume: '/icons/volume.ico',
  homepage: '/icons/homepage.ico',
  floppysave: '/icons/floppysave.ico'
};

const TaskBar = ({ onStartClick, isStartMenuOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const appButton = {
    height: '28px',  // Increased from 23px
    minWidth: '160px',
    margin: '0 2px',
    padding: '0 10px', // Slightly increased padding
    border: '1px solid #0f3f95',
    borderRadius: '2px',
    fontSize: '11px',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  };

const getAppStyle = (path) => ({
    ...appButton,
    background: location.pathname === path ?
        'linear-gradient(to bottom, #1c51b7 0%, #1644a7 15%, #15419e 40%, #15419e 100%)' :
        'linear-gradient(to bottom, #2584ff 0%, #2584ff 5%, #1159d5 8%, #1159d5 95%, #0b47a8 100%)',
    color: '#ffffff', // Always white text
    boxShadow: location.pathname === path ?
        'inset 1px 1px 0 rgba(255,255,255,0.2)' :
        'inset 1px 1px 0 rgba(255,255,255,0.1)',
    textShadow: '1px 1px 1px rgba(0,0,0,0.4)', // Always add text shadow
});

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '36px', // Increased from 30px
      background: 'linear-gradient(to bottom, #2584ff 0%, #2584ff 5%, #1159d5 8%, #1159d5 95%, #0b47a8 100%)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 3px', // Slightly increased padding
      zIndex: 1000,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
      borderTop: '1px solid #0842a0',
    }}>
      <button 
        onClick={onStartClick}
        style={{
          background: 'linear-gradient(to bottom, #5aa948 0%, #4a992d 3%, #3c8b27 6%, #297c13 100%)',
          border: '1px solid #215315',
          borderRadius: '3px',
          color: 'white',
          padding: '1px 12px', // Slightly increased padding
          height: '30px', // Increased from 25px
          margin: '2px 3px',
          display: 'flex',
          alignItems: 'center',
          fontWeight: 'bold',
          fontFamily: 'Tahoma, sans-serif',
          fontSize: '11px',
          cursor: 'pointer',
          boxShadow: '1px 1px 0 rgba(255,255,255,0.3) inset, -1px -1px 0 rgba(0,0,0,0.2) inset',
          textShadow: '1px 1px 1px rgba(0,0,0,0.4)',
        }}
      >
        <img 
          src={xpLogo} 
          alt="Windows XP"
          style={{
            width: '18px', // Increased from 15px
            height: '17px', // Increased from 14px
            marginRight: '5px',
            filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))',
          }}
        />
        start
      </button>

      <div style={{ 
        display: 'flex', 
        flex: 1, 
        margin: '0 4px',
        gap: '3px',
      }}>
        <button
          onClick={() => navigate('/')}
          style={getAppStyle('/')}
        >
          <img 
            src={ICONS.homepage}
            alt="Home"
            style={{
              width: '16px',
              height: '16px',
              marginRight: '4px',
              opacity: location.pathname === '/' ? 0.8 : 1
            }}
          />
          Home
        </button>
        <button
          onClick={() => navigate('/saved')}
          style={getAppStyle('/saved')}
        >
          <img 
            src={ICONS.floppysave}
            alt="Saved"
            style={{
              width: '16px',
              height: '16px',
              marginRight: '4px',
              opacity: location.pathname === '/saved' ? 0.8 : 1
            }}
          />
          Saved Items
        </button>
      </div>

      <div style={{
        background: 'linear-gradient(to bottom, #2467dd 0%, #1d5bc5 100%)',
        padding: '0 12px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        fontFamily: 'Tahoma, sans-serif',
        fontSize: '11px',
        borderLeft: '1px solid #1752b7',
        boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.2)',
        textShadow: '1px 1px 1px rgba(0,0,0,0.4)',
      }}>
        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default TaskBar;
