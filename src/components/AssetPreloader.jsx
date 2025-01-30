import { useEffect } from 'react';

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

  return null;
};

export default AssetPreloader;
