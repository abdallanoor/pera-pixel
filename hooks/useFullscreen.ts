import { useEffect, useState } from 'react';

export function useFullscreen(): boolean {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange'
    ];

    events.forEach(event => {
      document.addEventListener(event, handleFullscreenChange);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleFullscreenChange);
      });
    };
  }, []);

  return isFullscreen;
}

