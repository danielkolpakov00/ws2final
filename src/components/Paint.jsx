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

const Paint = ({ onClose }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState(TOOLS.PENCIL);
  const [strokeWidth, setStrokeWidth] = useState(2);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

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
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleCanvasClick = (e) => {
    if (tool === TOOLS.FILL) {
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
      }}>
        {/* Window Header */}
        <div 
          className="window-header"
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(to bottom, #0058e7, #3390ff)',
            padding: '2px',
            cursor: 'grab',
          }}
        >
          <div style={{ 
            color: 'white', 
            fontWeight: 'bold', 
            fontSize: '13px', // Increased font size
            padding: '0 4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <img src="/icons/paint.ico" alt="Paint" style={{ width: '16px', height: '16px' }} />
            Paint
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
