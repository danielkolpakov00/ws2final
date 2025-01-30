// import necessary react hooks and components
import React, { useReducer, useCallback, useEffect, useState } from 'react';
import WindowControls from './WindowControls';

// todo: add difficulty selector
// todo: add timer functionality
// todo: add mine counter
// todo: add high scores
// todo: add sound effects
// todo: add animations for reveals

// object containing all game icons and their paths
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

// define all possible actions for the game reducer
const actions = {
  // setup initializes a new game
  SETUP: 'SETUP',
  // reveal handles clicking a cell
  REVEAL: 'REVEAL',
  // flag handles right-clicking a cell
  FLAG: 'FLAG',
  // game over handles losing the game
  GAME_OVER: 'GAME_OVER',
  // reset handles starting a new game
  RESET: 'RESET'
};


// Set() is a built-in JavaScript object that stores unique values of any type



// creates the initial state for a new game
const createInitialState = () => ({
  // 2d array representing the game board
  grid: [],
  // set containing coordinates of all mines
  mineLocations: new Set(),
  // set containing coordinates of revealed cells
  revealed: new Set(),
  // set containing coordinates of flagged cells
  flags: new Set(),
  // current game status (waiting, playing, gameOver, win)
  gameStatus: 'waiting',
  // number of mines remaining to be flagged
  remainingMines: 10,
  // board dimensions
  dimensions: { width: 9, height: 9 }
});

// main reducer function that handles all game actions
const gameReducer = (state, action) => {
  switch (action.type) {
    case actions.SETUP:
      // creates a fresh game board with new mine positions
      return {
        ...createInitialState(),
        grid: generateGrid(9, 9, 10),
        mineLocations: placeMines(9, 9, 10),
        gameStatus: 'playing'
      };
    
    case actions.REVEAL:
      // handles revealing cells and checks for mine hits
      if (state.gameStatus !== 'playing') return state;
      const cellKey = `${action.payload.x},${action.payload.y}`;
      
      // Check if mine was hit
      if (state.mineLocations.has(cellKey)) {
        return {
          ...state,
          revealed: new Set([...state.revealed, ...state.mineLocations]), // reveal all mines
          gameStatus: 'gameOver'
        };
      }

      // Normal cell reveal
      const revealedCells = floodFill(
        action.payload,
        state.grid,
        state.mineLocations,
        state.revealed,
        state.dimensions
      );

      const newRevealed = new Set([...state.revealed, ...revealedCells]);
      
      // Check for win condition
      const totalCells = state.dimensions.width * state.dimensions.height;
      const isWin = newRevealed.size + state.mineLocations.size === totalCells;

      return {
        ...state,
        revealed: newRevealed,
        gameStatus: isWin ? 'win' : 'playing'
      };

    case actions.FLAG:
      // handles placing and removing flags
      const flags = new Set(state.flags);
      const cellKeyFlag = `${action.payload.x},${action.payload.y}`;
      flags.has(cellKeyFlag) ? flags.delete(cellKeyFlag) : flags.add(cellKeyFlag);
      return {
        ...state,
        flags,
        remainingMines: state.remainingMines + (flags.has(cellKeyFlag) ? -1 : 1)
      };

    default:
      return state;
  }
};

// custom hook that manages game state and actions
const useMinefield = () => {
  // initialize game state using reducer
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);

  // start new game when component mounts
  useEffect(() => {
    dispatch({ type: actions.SETUP });
  }, []);

  // memoized handler for cell clicks
  const handleCellClick = useCallback((x, y) => {
    dispatch({ type: actions.REVEAL, payload: { x, y } });
  }, []);

  // memoized handler for right clicks (flags)
  const handleRightClick = useCallback((e, x, y) => {
    e.preventDefault();
    dispatch({ type: actions.FLAG, payload: { x, y } });
  }, []);

  // expose state and handlers to component
  return { state, handleCellClick, handleRightClick, dispatch };
};

// creates empty game board grid
const generateGrid = (width, height, mines) => {
  // returns 2d array of empty cells
  return Array(height).fill().map(() => 
    Array(width).fill().map(() => ({
      value: 0,
      revealed: false,
      flagged: false
    }))
  );
};

// randomly places mines on the board
const placeMines = (width, height, mineCount) => {
  // uses set to ensure unique mine positions
  const mines = new Set();
  while (mines.size < mineCount) {
    const pos = `${Math.floor(Math.random() * width)},${Math.floor(Math.random() * height)}`;
    mines.add(pos);
  }
  return mines;
};

// reveals connected empty cells using flood fill algorithm
const floodFill = (start, grid, mines, revealed, dimensions) => {
  // implements breadth-first search for revealing cells
  const toReveal = new Set();
  const stack = [start];

  while (stack.length) {
    const {x, y} = stack.pop();
    const key = `${x},${y}`;

    if (toReveal.has(key)) continue;
    if (mines.has(key)) continue;
    if (x < 0 || x >= dimensions.width || y < 0 || y >= dimensions.height) continue;

    toReveal.add(key);

    // if cell is empty, continue flood fill
    if (countAdjacentMines(x, y, mines, dimensions) === 0) {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          stack.push({x: x + dx, y: y + dy});
        }
      }
    }
  }

  return toReveal;
};

// counts mines adjacent to a cell
const countAdjacentMines = (x, y, mines, dimensions) => {
  // checks all 8 surrounding cells for mines
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      const key = `${x + dx},${y + dy}`;
      if (mines.has(key)) count++;
    }
  }
  return count;
};

// main minesweeper component
const Minesweeper = ({ onClose }) => {
  // state for window management
  const [windowState, setWindowState] = useState({
    isMinimized: false,
    isMaximized: false
  });
  const [position, setPosition] = useState({ x: window.innerWidth/2 - 150, y: window.innerHeight/2 - 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState(1);

  // game state and handlers from custom hook
  const { state, handleCellClick, handleRightClick, dispatch } = useMinefield();

  // window dragging functionality
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

  // renders game board and controls
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
          gridTemplateColumns: `repeat(${state.dimensions.width}, 23px)`, // Adjusted from 25px
          gap: '1px',
          background: '#888',
          border: '4px solid #808080',
        }}>
          {state.grid.map((row, y) => 
            row.map((_, x) => {
              const key = `${x},${y}`;
              const isRevealed = state.revealed.has(key);
              const isFlagged = state.flags.has(key);
              const isMine = state.mineLocations.has(key);

              return (
                <div
                  key={key}
                  onClick={() => handleCellClick(x, y)}
                  onContextMenu={(e) => handleRightClick(e, x, y)}
                  style={{
                    width: '23px', // Adjusted from 25px
                    height: '23px', // Adjusted from 25px
                    background: isRevealed ? '#ccc' : '#c0c0c0',
                    border: isRevealed ? '1px solid #888' : '2px outset #fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  {renderCell(isRevealed, isFlagged, isMine, x, y, state)}
                </div>
              );
            })
          )}
        </div>
        {(state.gameStatus === 'gameOver' || state.gameStatus === 'win') && (
          <div class="font-xptahoma" style={{ textAlign: 'center', marginTop: '10px' }}>
            {state.gameStatus === 'win' ? 'You Win!' : 'Game Over!'}
            <button  class="font-xptahoma text-sm"
              onClick={() => dispatch({ type: actions.SETUP })}
              style={{
                marginLeft: '10px',
                padding: '2px 8px',
                background: '#ECE9D8',
                border: '2px outset #fff',
                cursor: 'pointer'
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

// renders individual cell content based on state
const renderCell = (revealed, flagged, isMine, x, y, state) => {
  // determines what to show in each cell (flag, mine, number)
  // uses color mapping for numbers 1-8
  // includes proper styling for cell contents
  if (flagged) return <img src={ICONS.flag} alt="Flag" style={{ width: '16px', height: '16px' }} />;
  if (!revealed) return null;
  if (isMine) return <img src={ICONS.mine} alt="Mine" style={{ width: '16px', height: '16px' }} />;
  
  const count = countAdjacentMines(x, y, state.mineLocations, state.dimensions);
  if (count > 0) {
    const colors = {
      1: '#0000FF', // blue
      2: '#008000', // green
      3: '#FF0000', // red
      4: '#000080', // navy
      5: '#800000', // maroon
      6: '#008080', // teal
      7: '#000000', // black
      8: '#808080'  // gray
    };

    return (
      <span style={{
        color: colors[count],
        fontSize: '14px',
        fontWeight: 'bold',
        fontFamily: 'Arial',
        lineHeight: '16px',
        width: '16px',
        height: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {count}
      </span>
    );
  }
  return null;
};

export default Minesweeper;

