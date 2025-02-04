import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import SavedCollectionPage from "./pages/SavedCollectionPage";
import Navbar from "./components/Navbar";
import Toolbar from "./components/Toolbar"
import TaskBar from "./components/TaskBar";
import WindowControls from "./components/WindowControls";
import StartMenu from './components/StartMenu';
import Minesweeper from './components/Minesweeper';
import AssetPreloader from './components/AssetPreloader';
import Paint from './components/Paint';

function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [windowState, setWindowState] = useState({
    id: 'main-window',
    isMinimized: false,
    isMaximized: false,
    isVisible: true,
    title: 'Last.fm Explorer'
  });
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [showMinesweeper, setShowMinesweeper] = useState(false);
  const [showPaint, setShowPaint] = useState(false);
  const [savedTracks, setSavedTracks] = useState(() => {
    const saved = localStorage.getItem('savedTracks');
    return saved ? JSON.parse(saved) : [];
  });
  const [zIndex, setZIndex] = useState(1);
  const [openWindows, setOpenWindows] = useState({
    explorer: true,
    minesweeper: false,
    paint: false
  });
  const [activeWindow, setActiveWindow] = useState(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    setZIndex(prev => prev + 1); // Increment z-index when dragging starts
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMinimize = () => {
    setWindowState(prev => ({ ...prev, isMinimized: true }));
  };

  const handleMaximize = () => {
    setWindowState(prev => ({ ...prev, isMaximized: !prev.isMaximized }));
  };

  const handleClose = () => {
    setWindowState(prev => ({ ...prev, isVisible: false }));
    setOpenWindows(prev => ({ ...prev, explorer: false }));
  };

  const toggleStartMenu = () => {
    console.log('Toggling start menu');  // Add logging
    setIsStartMenuOpen(prev => !prev);
  };

  const handleMinesweeperClick = () => {
    console.log('Opening Minesweeper');  // Add logging
    setShowMinesweeper(true);
    setOpenWindows(prev => ({ ...prev, minesweeper: true }));
    setIsStartMenuOpen(false);
  };

  const handlePaintClick = () => {
    setShowPaint(true);
    setOpenWindows(prev => ({ ...prev, paint: true }));
    setIsStartMenuOpen(false);
  };

  const showWindow = () => {
    setWindowState(prev => ({ ...prev, isVisible: true, isMinimized: false }));
  };

  const handleSaveTrack = (track) => {
    setSavedTracks(prev => {
      const exists = prev.some(t => t.name === track.name && t.artist === track.artist);
      const newTracks = exists 
        ? prev.filter(t => t.name !== track.name || t.artist !== track.artist)
        : [...prev, track];
      
      // Save to localStorage
      localStorage.setItem('savedTracks', JSON.stringify(newTracks));
      return newTracks;
    });
  };

  const closeMinesweeper = () => {
    setShowMinesweeper(false);
    setOpenWindows(prev => ({ ...prev, minesweeper: false }));
  };

  const closePaint = () => {
    setShowPaint(false);
    setOpenWindows(prev => ({ ...prev, paint: false }));
  };

  const handleWindowClick = (windowId) => {
    setActiveWindow(windowId);
  };

  return (
    <Router>
      <AssetPreloader />
      <div 
        style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            objectFit: 'cover',
            zIndex: -1,
          }}
          ref={videoRef => {
            if (videoRef) {
              videoRef.playbackRate = 4.0;
              videoRef.onerror = () => {
                console.error('Error loading video');
                // Optionally set a fallback background here
              };
            }
          }}
        >
          <source src="/bliss.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <Navbar openWindows={openWindows} />
        {windowState.isVisible && !windowState.isMinimized && (
          <div 
            style={{
              position: 'absolute',
              width: windowState.isMaximized ? '100%' : '1024px',
              height: windowState.isMaximized ? 'calc(100% - 36px)' : 'fit-content',
              maxHeight: '90vh',
              overflowY: 'auto',
              left: windowState.isMaximized ? 0 : `${position.x}px`,
              top: windowState.isMaximized ? 0 : `${position.y}px`,
              background: "linear-gradient(to bottom, #E3E3E3, #FFFFFF)",
              border: "2px solid #FFFFFF",
              borderBottom: "3px solid #A9A9A9",
              borderRight: "3px solid #A9A9A9",
              borderRadius: "3px",
              boxShadow: "inset 2px 2px 0 #FFFFFF, inset -2px -2px 0 #808080",
              cursor: isDragging ? 'grabbing' : 'default',
              zIndex: zIndex,
            }}
          >
            <div 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'linear-gradient(to bottom, #0058e7, #3390ff)',
                padding: '2px',
                cursor: 'grab'
              }}
              onMouseDown={handleMouseDown}
            >
             
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '12px', padding: '0 4px' }}>
                {windowState.title}
              </div>
              <WindowControls
                onMinimize={handleMinimize}
                onMaximize={handleMaximize}
                onClose={handleClose}
              />
            </div>
            <div>
              
              <Toolbar />
              <Routes>
                <Route path="/" element={
                  <HomePage 
                    savedTracks={savedTracks} 
                    onSaveTrack={handleSaveTrack}
                  />
                } />
                <Route path="/details" element={<DetailPage />} />
                <Route 
                  path="/saved" 
                  element={
                    <SavedCollectionPage 
                      savedTracks={savedTracks} 
                      onSaveTrack={handleSaveTrack} 
                    />
                  } 
                />
              </Routes>
            </div>
          </div>
        )}
        <StartMenu 
          isOpen={isStartMenuOpen} 
          onClose={() => setIsStartMenuOpen(false)}
          onMinesweeperClick={handleMinesweeperClick}
          onPaintClick={() => setShowPaint(true)}
          onShowWindow={showWindow}
        />
        {showMinesweeper && (
          <Minesweeper onClose={closeMinesweeper} />
        )}
        {showPaint && (
          <Paint 
            onClose={closePaint}
            onMouseDown={() => handleWindowClick('paint')}
            style={{ zIndex: activeWindow === 'paint' ? 10 : 1 }}
          />
        )}
        <TaskBar 
          onStartClick={toggleStartMenu}
          isStartMenuOpen={isStartMenuOpen}
          openWindows={openWindows}
          activeWindow={activeWindow}
          onWindowClick={showWindow}
        />
      </div>
    </Router>
  );
}

export default App;
