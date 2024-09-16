'use client'; // Ensure this component is treated as a client component

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

function ConfigAos({ children }: React.PropsWithChildren) {
  useEffect(() => {
    // Initialize AOS
    AOS.init();

    // Refresh AOS on window resize or other triggers if needed
    const handleResize = () => {
      AOS.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return <div>{children}</div>;
}

export default ConfigAos;
