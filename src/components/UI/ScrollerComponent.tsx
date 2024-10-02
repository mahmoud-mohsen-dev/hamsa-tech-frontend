'use client';
import { useLocale } from 'next-intl';
import { useEffect } from 'react';

const ScrollerComponent = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const locale = useLocale();
  useEffect(() => {
    const scrollers =
      document.querySelectorAll<HTMLDivElement>('.scroller');

    // If a user hasn't opted in for reduced motion, then add the animation
    // if (
    //   !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // ) {
    addAnimation();
    // }

    function addAnimation() {
      scrollers.forEach((scroller) => {
        if (!scroller) return;

        // Add data-animated="true" to every `.scroller` on the page
        scroller.setAttribute('data-animated', 'true');
        if (locale === 'ar') {
          scroller.setAttribute('data-direction', 'right');
        }

        // Find the `.scroller__inner` and its children
        const scrollerInner = scroller.querySelector<HTMLDivElement>(
          '.scroller__inner'
        );
        if (!scrollerInner) return;

        const scrollerContent = Array.from(scrollerInner.children);

        // Clone each item and append it to `.scroller__inner`
        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true) as HTMLElement;
          duplicatedItem.setAttribute('aria-hidden', 'true');
          scrollerInner.appendChild(duplicatedItem);
        });
      });
    }
  }, [locale]); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div className='scroller container' dir='ltr'>
      <div className='scroller__inner'>{children}</div>
    </div>
  );
};

export default ScrollerComponent;
