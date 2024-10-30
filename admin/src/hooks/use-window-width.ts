import { useState, useEffect } from 'react';

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Function to update the window width
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set a timer to delay the resize update
    let timer: NodeJS.Timeout;

    const debouncedResize = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(handleResize, 500);
    };

    // Add event listener for window resize
    window.addEventListener('resize', debouncedResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timer);
    };
  }, []);

  return windowWidth;
};

export default useWindowWidth;