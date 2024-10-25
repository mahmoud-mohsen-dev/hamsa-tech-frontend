import { usePathname } from '@/navigation';
import { useEffect } from 'react';

const useAddColoredNavClass = () => {
  const pathname = usePathname();
  // To listen if the main section is loading or have an error and apply colored-navbar style to the header
  useEffect(() => {
    const mainElement = document.querySelector('main');
    const headerElement = document.querySelector('header');

    if (mainElement && headerElement) {
      // Only apply if the page is at the top
      if (window.scrollY === 0) {
        if (
          mainElement.querySelector('.loader') ||
          mainElement.querySelector('.error')
        ) {
          headerElement.classList.add('colored-navbar');
        }
      }
    }

    return () => {
      // Cleanup: Remove the 'colored-navbar' class when the component unmounts
      if (headerElement && pathname === '/') {
        headerElement.classList.remove('colored-navbar');
      }
    };
  }, []);
};

export default useAddColoredNavClass;
