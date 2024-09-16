import { useEffect } from 'react';

const useScrollHandler = () => {
  useEffect(() => {
    // The debounce function receives our function as a parameter
    const debounce = (fn: (...args: any[]) => void) => {
      // This holds the requestAnimationFrame reference, so we can cancel it if we wish
      let frame: number | null = null;

      // The debounce function returns a new function that can receive a variable number of arguments
      return (...params: any[]) => {
        // If the frame variable has been defined, clear it now, and queue for next frame
        if (frame) {
          cancelAnimationFrame(frame);
        }

        // Queue our function call for the next frame
        frame = requestAnimationFrame(() => {
          // Call our function and pass any params we received
          fn(...params);
        });
      };
    };

    // Reads out the scroll position and stores it in the data attribute
    const storeScroll = () => {
      document.documentElement.dataset.scroll = String(
        window.scrollY
      );
    };

    // Listen for new scroll events, here we debounce our `storeScroll` function
    document.addEventListener('scroll', debounce(storeScroll), {
      passive: true
    });

    // Update scroll position for first time
    storeScroll();

    // Cleanup on component unmount
    return () => {
      document.removeEventListener('scroll', debounce(storeScroll));
    };
  }, []);
};

export default useScrollHandler;
