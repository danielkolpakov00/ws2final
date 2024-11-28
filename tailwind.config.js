/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure Tailwind scans your files
  ],
  theme: {
    extend: {
      fontFamily: {
        xptahoma: ['"xptahoma"', 'Tahoma', 'Arial', 'sans-serif'], // Custom font with fallbacks
      },
      colors: {
        xpBlue: '#3a6ea5',      // Start menu and taskbar blue
        xpGreen: '#3c9d33',     // Accent green (like the Start button)
        xpYellow: '#ffc40d',    // Highlight yellow
        xpGray: '#d4d0c8',      // Window background gray
        xpWhite: '#ffffff',     // Pure white
        xpSkyBlue: '#9bc2eb',   // Default desktop sky blue
        xpDarkBlue: '#1c5d99',  // Darker taskbar blue
      },
      boxShadow: {
        glass: '0 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow for windows
        insetXP: 'inset 2px 2px 0 #A3D3F7, inset -2px -2px 0 #003E73', // XP-style inset shadow
      },
      borderRadius: {
        xp: '4px', // Rounded edges typical in XP UI
      },
      imageRendering: {
        pixelated: {
          'image-rendering': 'pixelated', // Ensures pixelated images for icons
        },
      },
    },
  },
  plugins: [],
};
