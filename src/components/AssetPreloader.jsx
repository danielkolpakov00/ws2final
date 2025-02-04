import React, { useEffect } from 'react';

const ASSETS = {
  icons: [
    '/icons/WindowsLogo.svg',
    '/icons/floppysave.ico',
    '/icons/homepage.ico',
    '/icons/microphone.ico',
    '/icons/minesweeper.ico',
    '/icons/flag.ico',
    '/icons/mine.ico',
    '/icons/empty.ico',
    '/icons/1.ico',
    '/icons/2.ico',
    '/icons/3.ico',
    '/icons/4.ico',
    '/icons/5.ico',
    '/icons/6.ico',
    '/icons/7.ico',
    '/icons/8.ico',
    '/icons/smiley.ico',
    '/icons/dead.ico',
    '/icons/cool.ico',
    '/icons/worried.ico',
    '/icons/minimize.ico',
    '/icons/maximize.ico',
    '/icons/close.ico'
  ],
  fonts: [
    '/src/fonts/xptahoma.ttf'
  ],
  videos: [
    '/bliss.mp4'
  ]
};

const PRELOAD_IMAGES = [
  '/icons/xp.png',
  '/icons/explorer.ico',
  '/icons/express.ico',
  '/icons/Windows_Media_Player.ico',
  '/icons/documents.ico',
  '/icons/pictures.ico',
  '/icons/music.ico',
  '/icons/computer.ico',
  '/icons/ctrlk.ico',
  '/icons/help.ico',
  '/icons/serch.ico',
  '/icons/logoff.ico',
  '/icons/shutdown.ico',
  '/icons/minesweeper.ico',
  '/icons/paint.ico',
  // Add any other icons you need to preload
];

const AssetPreloader = () => {
  useEffect(() => {
    // Preload images and icons
    ASSETS.icons.forEach(iconPath => {
      const img = new Image();
      img.src = iconPath;
    });

    // Preload fonts
    ASSETS.fonts.forEach(fontPath => {
      const font = new FontFace('xptahoma', `url(${fontPath})`);
      font.load().then(loadedFont => {
        document.fonts.add(loadedFont);
      }).catch(error => {
        console.error('Font loading failed:', error);
      });
    });

    // Preload videos
    ASSETS.videos.forEach(videoPath => {
      const video = document.createElement('video');
      video.preload = 'auto';
      const source = document.createElement('source');
      source.src = videoPath;
      video.appendChild(source);
    });
  }, []);

  return (
    <div style={{ display: 'none' }}>
      {PRELOAD_IMAGES.map((src, index) => (
        <img 
          key={index}
          src={src}
          alt=""
          onError={(e) => console.error(`Failed to load: ${src}`)}
        />
      ))}
    </div>
  );
};

export default AssetPreloader;
