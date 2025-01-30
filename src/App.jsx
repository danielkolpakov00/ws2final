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
  const NAVBAR_HEIGHT = 36;
  const TASKBAR_HEIGHT = 36;

  // Add new function to calculate window dimensions
  const getWindowDimensions = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Mobile
    if (width < 768) {
      return {
        width: width * 0.95,
        height: height * 0.7,
        initialX: width * 0.025,
        initialY: NAVBAR_HEIGHT + 10
      };
    }
    // Tablet
    if (width < 1024) {
      return {
        width: width * 0.85,
        height: height * 0.75,
        initialX: width * 0.075,
        initialY: NAVBAR_HEIGHT + 20
      };
    }
    // Desktop
    return {
      width: Math.min(1024, width * 0.8),
      height: Math.min(768, height - NAVBAR_HEIGHT - TASKBAR_HEIGHT - 40),
      initialX: (width - Math.min(1024, width * 0.8)) / 2,
      initialY: NAVBAR_HEIGHT + 20
    };
  };

  // Initialize position with calculated values
  const [position, setPosition] = useState(() => ({
    x: getWindowDimensions().initialX,
    y: getWindowDimensions().initialY
  }));

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

  // Add new state for resizing
  const [isResizing, setIsResizing] = useState(false);
  const [resizeEdge, setResizeEdge] = useState(null);
  const [windowSize, setWindowSize] = useState(() => ({
    width: getWindowDimensions().width,
    height: getWindowDimensions().height
  }));

  const [activeWindow, setActiveWindow] = useState('explorer'); // Add this new state

  // Update the handleWindowFocus function
  const handleWindowFocus = (windowId) => {
    if (activeWindow !== windowId) {
      setActiveWindow(windowId);
      setZIndex(prev => prev + 1);
    }
  };

  // Update window opening handlers
  const handleMinesweeperClick = () => {
    setShowMinesweeper(true);
    setOpenWindows(prev => ({ ...prev, minesweeper: true }));
    setIsStartMenuOpen(false);
    handleWindowFocus('minesweeper'); // Auto focus when opened
  };

  const handlePaintClick = () => {
    setShowPaint(true);
    setOpenWindows(prev => ({ ...prev, paint: true }));
    setIsStartMenuOpen(false);
    handleWindowFocus('paint');
  };

  const handleMouseDown = (e) => {
    handleWindowFocus('explorer'); // Focus main window when clicking its title bar
    if (!windowState.isMaximized) {
      setIsDragging(true);
      // Calculate offset relative to current window position
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      setZIndex(prev => prev + 1);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && !isResizing && !windowState.isMaximized) {
      // Calculate new position based on current mouse position and offset
      const newX = Math.min(
        Math.max(0, e.clientX - dragOffset.x),
        window.innerWidth - windowSize.width
      );
      const newY = Math.min(
        Math.max(NAVBAR_HEIGHT, e.clientY - dragOffset.y),
        window.innerHeight - TASKBAR_HEIGHT - windowSize.height
      );
      
      setPosition({ x: newX, y: newY });
    } else if (isResizing) {
      let newWidth = windowSize.width;
      let newHeight = windowSize.height;
      let newX = position.x;
      let newY = position.y;

      switch (resizeEdge) {
        case 'right':
          newWidth = Math.max(300, e.clientX - position.x);
          break;
        case 'bottom':
          newHeight = Math.max(200, e.clientY - position.y);
          break;
        case 'bottom-right':
          newWidth = Math.max(300, e.clientX - position.x);
          newHeight = Math.max(200, e.clientY - position.y);
          break;
        case 'top-left':
          newWidth = Math.max(300, windowSize.width + (position.x - e.clientX));
          newHeight = Math.max(200, windowSize.height + (position.y - e.clientY));
          newX = e.clientX;
          newY = e.clientY;
          break;
        case 'top-right':
          newWidth = Math.max(300, e.clientX - position.x);
          newHeight = Math.max(200, windowSize.height + (position.y - e.clientY));
          newY = e.clientY;
          break;
        case 'bottom-left':
          newWidth = Math.max(300, windowSize.width + (position.x - e.clientX));
          newHeight = Math.max(200, e.clientY - position.y);
          newX = e.clientX;
          break;
      }

      setWindowSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeEdge(null);
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
    // If paint was active, set focus back to explorer
    if (activeWindow === 'paint') {
      handleWindowFocus('explorer');
    }
  };

  // Add resize handler
  React.useEffect(() => {
    const handleResize = () => {
      const dims = getWindowDimensions();
      if (!windowState.isMaximized) {
        setPosition({
          x: dims.initialX,
          y: dims.initialY
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [windowState.isMaximized]);

  React.useEffect(() => {
    setPosition(prev => ({
      ...prev,
      y: Math.max(NAVBAR_HEIGHT, prev.y)
    }));
  }, []);

  // Add resize handlers
  const handleResizeStart = (e, edge) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeEdge(edge);
    setZIndex(prev => prev + 1);
  };

  const handleResizeMove = (e) => {
    if (!isResizing || windowState.isMaximized) return;

    let newWidth = windowSize.width;
    let newHeight = windowSize.height;
    let newX = position.x;
    let newY = position.y;

    switch (resizeEdge) {
      case 'right':
        newWidth = Math.max(300, e.clientX - position.x);
        break;
      case 'bottom':
        newHeight = Math.max(200, e.clientY - position.y);
        break;
      case 'bottom-right':
        newWidth = Math.max(300, e.clientX - position.x);
        newHeight = Math.max(200, e.clientY - position.y);
        break;
      case 'top-left':
        newWidth = Math.max(300, windowSize.width + (position.x - e.clientX));
        newHeight = Math.max(200, windowSize.height + (position.y - e.clientY));
        newX = e.clientX;
        newY = e.clientY;
        break;
      case 'top-right':
        newWidth = Math.max(300, e.clientX - position.x);
        newHeight = Math.max(200, windowSize.height + (position.y - e.clientY));
        newY = e.clientY;
        break;
      case 'bottom-left':
        newWidth = Math.max(300, windowSize.width + (position.x - e.clientX));
        newHeight = Math.max(200, e.clientY - position.y);
        newX = e.clientX;
        break;
    }

    setWindowSize({ width: newWidth, height: newHeight });
    setPosition({ x: newX, y: newY });
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizeEdge(null);
  };

  // Add to existing event listeners
  React.useEffect(() => {
    window.addEventListener('mouseup', handleResizeEnd);
    return () => window.removeEventListener('mouseup', handleResizeEnd);
  }, []);

  const handleWindowClick = (windowId) => {
    handleWindowFocus(windowId);
    
    if (windowId === 'explorer') {
      if (windowState.isMinimized || !windowState.isVisible) {
        setWindowState(prev => ({ 
          ...prev, 
          isMinimized: false, 
          isVisible: true 
        }));
      }
    } else if (windowId === 'minesweeper') {
      setShowMinesweeper(true);
      setOpenWindows(prev => ({ ...prev, minesweeper: true }));
    } else if (windowId === 'paint') {
      setShowPaint(true);
      setOpenWindows(prev => ({ ...prev, paint: true }));
    }
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
          disablePictureInPicture // Added to disable popout player
          disableRemotePlayback // Added to disable remote playback
          controlsList="nodownload nofullscreen noremoteplayback" // Added to remove native controls
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
              width: windowState.isMaximized ? '100%' : `${windowSize.width}px`,
              height: windowState.isMaximized 
                ? `calc(100% - ${NAVBAR_HEIGHT + TASKBAR_HEIGHT}px)` 
                : `${windowSize.height}px`,
              maxHeight: `calc(100vh - ${NAVBAR_HEIGHT + TASKBAR_HEIGHT}px)`,
              left: windowState.isMaximized ? 0 : `${position.x}px`,
              top: windowState.isMaximized ? NAVBAR_HEIGHT : `${position.y}px`,
              background: "linear-gradient(to bottom, #E3E3E3, #FFFFFF)",
              border: "2px solid #FFFFFF",
              borderBottom: "3px solid #A9A9A9",
              borderRight: "3px solid #A9A9A9",
              borderRadius: "3px",
              boxShadow: "inset 2px 2px 0 #FFFFFF, inset -2px -2px 0 #808080",
              cursor: isResizing ? `${resizeEdge}-resize` : (isDragging ? 'grabbing' : 'default'),
              zIndex: activeWindow === 'explorer' ? zIndex : zIndex - 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              height: windowState.isMaximized 
                ? `calc(100vh - ${NAVBAR_HEIGHT + TASKBAR_HEIGHT}px)` 
                : `${windowSize.height}px`,
            }}
            onMouseDown={() => handleWindowFocus('explorer')} // Changed from onClick to onMouseDown
            onMouseMove={handleMouseMove}
          >
            <div style={{ flexShrink: 0 }}>
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
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '12px', padding: '0 4px' }} className="font-xptahoma">
                  {windowState.title}
                </div>
                <WindowControls
                  onMinimize={handleMinimize}
                  onMaximize={handleMaximize}
                  onClose={handleClose}
                />
              </div>
            </div>
            <div style={{ 
              flex: 1,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Toolbar style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, overflow: 'hidden' }}>
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
            {/* Add resize handles */}
            {!windowState.isMaximized && (
              <>
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: '8px', // Increased width for easier resizing
                    cursor: 'e-resize'
                  }}
                  onMouseDown={(e) => handleResizeStart(e, 'right')}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '8px', // Increased height for easier resizing
                    cursor: 's-resize'
                  }}
                  onMouseDown={(e) => handleResizeStart(e, 'bottom')}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '16px', // Increased size for easier resizing
                    height: '16px',
                    cursor: 'se-resize'
                  }}
                  onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '16px', // Increased size for easier resizing
                    height: '16px',
                    cursor: 'nw-resize'
                  }}
                  onMouseDown={(e) => handleResizeStart(e, 'top-left')}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '16px', // Increased size for easier resizing
                    height: '16px',
                    cursor: 'ne-resize'
                  }}
                  onMouseDown={(e) => handleResizeStart(e, 'top-right')}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '16px', // Increased size for easier resizing
                    height: '16px',
                    cursor: 'sw-resize'
                  }}
                  onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
                />
              </>
            )}
          </div>
        )}
        <StartMenu 
          isOpen={isStartMenuOpen} 
          onClose={() => setIsStartMenuOpen(false)}
          onMinesweeperClick={handleMinesweeperClick}
          onPaintClick={handlePaintClick}  // Change this line to use handlePaintClick instead
          onShowWindow={showWindow}
        />
        {showMinesweeper && (
          <Minesweeper 
            onClose={closeMinesweeper} 
            onMouseDown={() => handleWindowFocus('minesweeper')} // Changed from onClick to onMouseDown
            style={{ zIndex: activeWindow === 'minesweeper' ? zIndex : zIndex - 1 }}
          />
        )}
        {showPaint && (
          <Paint 
            onClose={closePaint}
            onMouseDown={() => handleWindowFocus('paint')} // Changed from onClick to onMouseDown
            style={{ zIndex: activeWindow === 'paint' ? zIndex : zIndex - 1 }}
          />
        )}
        <TaskBar 
          onStartClick={toggleStartMenu}
          isStartMenuOpen={isStartMenuOpen}
          openWindows={openWindows}
          activeWindow={activeWindow}
          onWindowClick={handleWindowClick}
        />
      </div>
    </Router>
  );
}

export default App;
