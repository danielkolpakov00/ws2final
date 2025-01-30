import React, { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import WindowControls from './WindowControls';

const COLORS = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
  '#c0dcc0', '#a6caf0', '#ffffce', '#e7e7e7', '#ccffff', '#fff0f0', '#cececf', '#ffccff',
];

const TOOLS = {
  PENCIL: 'pencil',
  ERASER: 'eraser',
  FILL: 'fill'
};

const STROKE_WIDTHS = [1, 2, 3, 4, 5];

const Paint = ({ onClose, onMouseDown, style }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState(TOOLS.PENCIL);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [undoStack, setUndoStack] = useState([]);
  
  // Load saved state from localStorage on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Try to load saved canvas state
    const savedCanvas = localStorage.getItem('paintCanvas');
    const savedUndoStack = localStorage.getItem('paintUndoStack');

    if (savedCanvas && savedUndoStack) {
      const img = new Image();
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
      };
      img.src = savedCanvas;
      setUndoStack(JSON.parse(savedUndoStack));
    } else {
      // Initial white background
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
      const initialState = canvas.toDataURL();
      setUndoStack([initialState]);
      localStorage.setItem('paintUndoStack', JSON.stringify([initialState]));
      localStorage.setItem('paintCanvas', initialState);
    }

    const handleKeyDown = (e) => {
      console.log('Key pressed:', e.key, 'Meta:', e.metaKey, 'Ctrl:', e.ctrlKey);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        console.log('Undo command detected');
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Modify saveCanvasState to persist to localStorage
  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const newState = canvas.toDataURL();
    console.log('Saving new state. Stack size:', undoStack.length + 1);
    setUndoStack(prev => {
      const newStack = [...prev, newState];
      localStorage.setItem('paintUndoStack', JSON.stringify(newStack));
      localStorage.setItem('paintCanvas', newState);
      return newStack;
    });
  };

  // Modify handleUndo to update localStorage
  const handleUndo = () => {
    console.log('Undo called. Stack size:', undoStack.length);
    if (undoStack.length <= 1) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      console.log('Previous state restored');
    };
    img.src = undoStack[undoStack.length - 2];
    
    setUndoStack(prev => {
      const newStack = prev.slice(0, -1);
      localStorage.setItem('paintUndoStack', JSON.stringify(newStack));
      localStorage.setItem('paintCanvas', newStack[newStack.length - 1]);
      return newStack;
    });
  };

  const getPixel = (imageData, x, y) => {
    if (x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) {
      return [-1, -1, -1, -1];  // impossible color
    }
    const offset = (y * imageData.width + x) * 4;
    return imageData.data.slice(offset, offset + 4);
  };

  const setPixel = (imageData, x, y, color) => {
    const offset = (y * imageData.width + x) * 4;
    imageData.data[offset] = color[0];
    imageData.data[offset + 1] = color[1];
    imageData.data[offset + 2] = color[2];
    imageData.data[offset + 3] = color[3];
  };

  const colorsMatch = (a, b) => {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  };

  const hexToRgba = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b, 255];
  };

  const fill = (startX, startY) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const targetColor = getPixel(imageData, startX, startY);
    const fillColor = hexToRgba(color);

    if (colorsMatch(targetColor, fillColor)) return;

    const pixelsToCheck = [[startX, startY]];
    
    while (pixelsToCheck.length > 0) {
      const [x, y] = pixelsToCheck.pop();
      const currentColor = getPixel(imageData, x, y);

      if (!colorsMatch(currentColor, targetColor)) continue;

      setPixel(imageData, x, y, fillColor);

      // Add adjacent pixels
      pixelsToCheck.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
    
    saveCanvasState();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    ctx.strokeStyle = tool === TOOLS.ERASER ? '#ffffff' : color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    
    ctx.lineTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      console.log('Saving state after drawing');
      saveCanvasState();
    }
    setIsDrawing(false);
  };

  // Add cleanup to existing clearCanvas
  const clearCanvas = () => {
    saveCanvasState();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save the cleared state
    const clearedState = canvas.toDataURL();
    localStorage.setItem('paintCanvas', clearedState);
  };

  const handleCanvasClick = (e) => {
    if (tool === TOOLS.FILL) {
      saveCanvasState();
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.floor(e.clientX - rect.left);
      const y = Math.floor(e.clientY - rect.top);
      fill(x, y);
    }
  };

  const buttonStyle = {
    padding: '2px 4px',
    background: '#ECE9D8',
    border: '1px solid #ACA899',
    borderBottom: '1px solid #706D64',
    borderRight: '1px solid #706D64',
    cursor: 'pointer',
    fontSize: '12px',
    minWidth: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <Draggable handle=".window-header">
      <div className="font-xptahoma" style={{
        position: 'absolute',
        width: '608px',  // Exact canvas width + minimal padding
        height: '495px', // Exact canvas height + header/toolbar height
        top: '50px',
        left: '50px',
        background: '#ECE9D8',
        border: '1px solid #000000',
        boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
        ...style
      }} onMouseDown={onMouseDown}>
        {/* Window Header */}
        <div 
          className="window-header flex items-center justify-between p-2"
          style={{ 
            background: "linear-gradient(to bottom, #0058e7, #3390ff)",
            cursor: 'grab'
          }}
        >
          <div className="flex items-center">
            <img src="/icons/paint.ico" alt="Paint" className="w-4 h-4 mr-2" />
            <span className="text-white font-bold font-xptahoma text-sm">Paint</span>
          </div>
          <WindowControls
            onMinimize={() => {}}
            onMaximize={() => {}}
            onClose={onClose}
          />
        </div>

        {/* Menu Bar */}
        <div style={{
          padding: '2px',
          borderBottom: '1px solid #ACA899',
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['File', 'Edit', 'View', 'Image', 'Colors', 'Help'].map(text => (
              <button key={text} style={{
                ...buttonStyle,
                fontSize: '13px', // Increased font size
                padding: '2px 8px'
              }}>
                {text}
              </button>
            ))}
          </div>
        </div>

        {/* Tools and Options Bar */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #ACA899',
          padding: '3px',
          gap: '3px'
        }}>
          {/* Tools */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '2px',
            padding: '3px',
            border: '1px solid #ACA899',
            background: '#F5F4EA',
            width: 'fit-content',
          }}>
            <button
              onClick={() => setTool(TOOLS.PENCIL)}
              style={{
                ...buttonStyle,
                background: tool === TOOLS.PENCIL ? '#cce4ff' : '#ECE9D8',
              }}
            >
              ✏️
            </button>
            <button
              onClick={() => setTool(TOOLS.ERASER)}
              style={{
                ...buttonStyle,
                background: tool === TOOLS.ERASER ? '#cce4ff' : '#ECE9D8',
              }}
            >
              🧽
            </button>
            <button
              onClick={() => setTool(TOOLS.FILL)}
              style={{
                ...buttonStyle,
                background: tool === TOOLS.FILL ? '#cce4ff' : '#ECE9D8',
              }}
            >
              🪣
            </button>
            <button
              onClick={clearCanvas}
              style={buttonStyle}
            >
              🗑️
            </button>
          </div>

          {/* Stroke Width */}
          <div style={{
            padding: '3px',
            border: '1px solid #ACA899',
            background: '#F5F4EA',
          }}>
            <select 
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              style={{
                ...buttonStyle,
                padding: '1px'
              }}
            >
              {STROKE_WIDTHS.map(width => (
                <option key={width} value={width}>{width}px</option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ 
          display: 'flex', 
          height: 'calc(100% - 80px)'  // Subtract header + toolbar height
        }}>
          {/* Color Palette */}
          <div style={{
            width: '32px', // Reduced width
            background: '#F5F4EA',
            borderRight: '1px solid #ACA899',
            padding: '4px',
          }}>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(1, 1fr)', // Single column
              gap: '2px',
            }}>
              {COLORS.map((c) => (
                <div
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: '15px',
                    height: '15px',
                    backgroundColor: c,
                    border: color === c ? '2px solid #000' : '1px solid #999',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Canvas Area */}
          <div style={{ 
            flex: 1,
            background: '#808080',
            padding: '4px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              onMouseDown={tool === TOOLS.FILL ? handleCanvasClick : startDrawing}
              onMouseMove={tool === TOOLS.FILL ? null : draw}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              style={{
                background: 'white',
                cursor: tool === TOOLS.FILL ? 'crosshair' : 
                        tool === TOOLS.ERASER ? 'cell' : 'crosshair',
                boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)'
              }}
            />
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default Paint;
