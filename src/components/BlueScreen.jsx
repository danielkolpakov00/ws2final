import React, { useEffect, useState } from 'react';

const BlueScreen = () => {
  const [text, setText] = useState('');
  const fullText = `
>_ FATAL_SYSTEM_ERROR_0x000000D1
>_ DRIVER_IRQL_NOT_LESS_OR_EQUAL

>_ Technical Analysis:
>_ * Memory corruption detected
>_ * System thread compromised
>_ * Kernel panic initiated
>_ * Multiple stack overflow detected

>_ Initializing memory dump...
>_ ████████████░░░░░░░░░░ 48%

>_ WARNING: System unstable
>_ CRITICAL: Press F5 or CTRL+R to reboot system
`;

  useEffect(() => {
    let currentChar = 0;
    const typeEffect = setInterval(() => {
      setText(fullText.substring(0, currentChar));
      currentChar++;
      if (currentChar > fullText.length) clearInterval(typeEffect);
    }, 10);  // Changed from 50 to 10ms for faster typing

    const handleKeyPress = (e) => {
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        window.location.reload();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      clearInterval(typeEffect);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#0000AA', // Classic BSOD blue
      color: '#FFFFFF',          // White text
      padding: '20px',
      fontFamily: 'Consolas, monospace',
      fontSize: '16px',
      zIndex: 100000,
      overflow: 'hidden',
      animation: 'flicker 0.15s infinite',
    }}>
      <style>
        {`
          @keyframes flicker {
            0% { opacity: 1; }
            3% { opacity: 0.9; }
            6% { opacity: 1; }
            7% { opacity: 0.95; }
            8% { opacity: 1; }
            9% { opacity: 0.94; }
            10% { opacity: 1; }
            100% { opacity: 1; }
          }
          
          @keyframes scan {
            from { text-shadow: 0 0 10px #fff; }
            to { text-shadow: 0 2px 5px #fff; }
          }
        `}
      </style>
      <pre style={{
        whiteSpace: 'pre-wrap',
        textShadow: '0 0 8px #fff',
        animation: 'scan 2s linear infinite',
        lineHeight: '1.5',
      }}>
        {text}
      </pre>
    </div>
  );
};

export default BlueScreen;
