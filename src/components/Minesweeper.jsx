import React, { useState, useEffect } from 'react';
import WindowControls from './WindowControls';

const ICONS = {
  flag: '/icons/flag.ico',
  mine: '../../icons/mine.ico',
  empty: '/icons/empty.ico',
  num1: '/icons/1.ico',
  num2: '/icons/2.ico',
  num3: '/icons/3.ico',
  num4: '/icons/4.ico',
  num5: '/icons/5.ico',
  num6: '/icons/6.ico',
  num7: '/icons/7.ico',
  num8: '/icons/8.ico',
  smiley: '/icons/smiley.ico',
  dead: '/icons/dead.ico',
  cool: '/icons/cool.ico',
  worried: '/icons/worried.ico',
  minimize: '/icons/minimize.ico',
  maximize: '/icons/maximize.ico',
  close: '/icons/close.ico'

};

const Minesweeper = ({ onClose }) => {
  const [windowState, setWindowState] = useState({
    isMinimized: false,
    isMaximized: false
  });
  const [position, setPosition] = useState({ x: window.innerWidth/2 - 150, y: window.innerHeight/2 - 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [zIndex, setZIndex] = useState(1);
  const rows = 9;
  const cols = 9;
  const mines = 10;

  // Initialize board
  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    // Reset game state
    setGameOver(false);
    setWin(false);
    
    // Create empty board
    let newBoard = Array(rows).fill().map(() => 
      Array(cols).fill().map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mines
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!newBoard[i][j].isMine) {
          let count = 0;
          // Check all 8 neighbors
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              if (i + di >= 0 && i + di < rows && j + dj >= 0 && j + dj < cols) {
                if (newBoard[i + di][j + dj].isMine) count++;
              }
            }
          }
          newBoard[i][j].neighborMines = count;
        }
      }
    }

    setBoard(newBoard);
  };

  const handleCellClick = (row, col) => {
    if (gameOver || win || board[row][col].isFlagged) return;

    const newBoard = [...board];
    if (board[row][col].isMine) {
      setGameOver(true);
      revealAll();
      return;
    }

    revealCell(row, col, newBoard);
    setBoard(newBoard);
    checkWin();
  };

  const handleRightClick = (e, row, col) => {
    e.preventDefault();
    if (gameOver || win || board[row][col].isRevealed) return;

    const newBoard = [...board];
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
  };

  const revealCell = (row, col, newBoard) => {
    if (row < 0 || row >= rows || col < 0 || col >= cols || 
        newBoard[row][col].isRevealed || newBoard[row][col].isFlagged) return;

    newBoard[row][col].isRevealed = true;

    if (newBoard[row][col].neighborMines === 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          revealCell(row + i, col + j, newBoard);
        }
      }
    }
  };

  const revealAll = () => {
    const newBoard = board.map(row => 
      row.map(cell => ({ ...cell, isRevealed: true }))
    );
    setBoard(newBoard);
  };

  const checkWin = () => {
    const win = board.every(row => 
      row.every(cell => 
        cell.isRevealed === !cell.isMine
      )
    );
    if (win) setWin(true);
  };

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

  if (windowState.isMinimized) return null;

  return (
    <div
      style={{
        position: 'absolute',
        width: windowState.isMaximized ? '100%' : '249px',
        left: windowState.isMaximized ? 0 : `${position.x}px`,
        top: windowState.isMaximized ? 0 : `${position.y}px`,
        background: "linear-gradient(to bottom, #E3E3E3, #FFFFFF)",
        border: "2px solid #FFFFFF",
        borderBottom: "3px solid #A9A9A9",
        borderRight: "3px solid #A9A9A9",
        borderRadius: "3px",
        boxShadow: "inset 2px 2px 0 #FFFFFF, inset -2px -2px 0 #808080",
        zIndex: zIndex,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Window Header */}
      <div 
        className="flex items-center justify-between p-2"
        style={{ 
          background: "linear-gradient(to bottom, #0058e7, #3390ff)",
          cursor: 'grab'
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center">
          <img src="../../icons/minesweeper.ico" alt="Minesweeper" className="w-4 h-4 mr-2" />
          <span className="text-white font-bold font-xptahoma text-sm">Minesweeper</span>
        </div>
        <WindowControls
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onClose={onClose}
        />
      </div>

      {/* Minesweeper Game Content */}
      <div style={{ padding: '10px', background: '#ECE9D8' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 23px)`, // Adjusted from 25px
          gap: '1px',
          background: '#888',
          border: '4px solid #808080',
        }}>
          {board.map((row, i) => 
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                onClick={() => handleCellClick(i, j)}
                onContextMenu={(e) => handleRightClick(e, i, j)}
                style={{
                  width: '23px', // Adjusted from 25px
                  height: '23px', // Adjusted from 25px
                  background: cell.isRevealed ? '#ccc' : '#c0c0c0',
                  border: cell.isRevealed ? '1px solid #888' : '2px outset #fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                {cell.isRevealed ? (
                  cell.isMine ? (
                    <img src={ICONS.mine} alt="Mine" />
                  ) : cell.neighborMines > 0 ? (
                    <span style={{
                      color: ['blue', 'green', 'red', 'purple', 'maroon', 'turquoise', 'black', 'gray'][cell.neighborMines - 1]
                    }}>
                      {cell.neighborMines}
                    </span>
                  ) : null
                ) : cell.isFlagged ? (
                  <img src={ICONS.flag} alt="Flag" />
                ) : null}
              </div>
            ))
          )}
        </div>
        {(gameOver || win) && (
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            {win ? 'You Win!' : 'Game Over!'}
            <button 
              onClick={initializeBoard}
              style={{
                marginLeft: '10px',
                padding: '2px 8px',
                background: '#ECE9D8',
                border: '2px outset #fff',
              }}
            >
              New Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Minesweeper;
