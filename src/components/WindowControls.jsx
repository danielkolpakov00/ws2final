import React from 'react';

const WindowControls = ({ onMinimize, onMaximize, onClose }) => {
  const buttonBaseStyle = {
    width: '20px',
    height: '20px',
    border: '2px solid #FFFFFF',
    borderBottom: "2px solid #A9A9A9",
    borderRight: "2px solid #A9A9A9",
    borderRadius: "3px",
    color: '#000',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '1px',
  };

  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      <button
        onClick={onMinimize}
        style={{
          ...buttonBaseStyle,
          background: 'linear-gradient(to bottom, #E3E3E3, #9d9d9d)',
        }}
      >
        _
      </button>
      <button
        onClick={onMaximize}
        style={{
          ...buttonBaseStyle,
          background: 'linear-gradient(to bottom, #E3E3E3, #9d9d9d)',
        }}
      >
        □
      </button>
      <button
        onClick={onClose}
        style={{
          ...buttonBaseStyle,
          background: 'linear-gradient(to bottom, #ff6b6b, #df1f1f)',
          color: 'white',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'linear-gradient(to bottom, #ff8785, #eb3939)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'linear-gradient(to bottom, #ff6b6b, #df1f1f)';
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default WindowControls;
