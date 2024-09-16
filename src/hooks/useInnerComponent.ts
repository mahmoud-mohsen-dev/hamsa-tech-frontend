import { useState, useEffect } from 'react';

const useInnerComponent = (
  component: React.MutableRefObject<HTMLDivElement | null>
) => {
  const [dimensions, setDimensions] = useState({
    width: component?.current?.clientWidth,
    height: component?.current?.clientHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: component?.current?.clientWidth,
        height: component?.current?.clientHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
};

export default useInnerComponent;
